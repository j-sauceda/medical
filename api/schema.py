import graphene
import graphql_jwt
from graphene_django import DjangoObjectType
from graphql_auth import mutations
from graphql_auth.schema import UserQuery, MeQuery
from django.utils import timezone

from .models import User, BusinessHour, Doctor, Appointment


class AuthMutation(graphene.ObjectType):
   register = mutations.Register.Field()
   verify_account = mutations.VerifyAccount.Field()
   token_auth = mutations.ObtainJSONWebToken.Field()
   update_account = mutations.UpdateAccount.Field()
   resend_activation_email = mutations.ResendActivationEmail.Field()
   send_password_reset_email = mutations.SendPasswordResetEmail.Field()
   password_reset = mutations.PasswordReset.Field()
   password_change = mutations.PasswordChange.Field()
   verify_token = graphql_jwt.Verify.Field()
   refresh_token = graphql_jwt.Refresh.Field()
   revoke_token = graphql_jwt.Revoke.Field()

class UserType(DjangoObjectType):
    class Meta:
        model = User
        fields = ("id", "is_doctor", "username", "first_name", "last_name", "dob", "phone", "email", "allergies", "permanent_treatments")


class BusinessHourType(DjangoObjectType):
    class Meta:
        model = BusinessHour
        fields = ("id", "description", "start_time", "end_time", "lunch_time", "minutes_per_appointment")


class DoctorType(DjangoObjectType):
    class Meta:
        model = Doctor
        fields = ("id", "user_id", "business_hours", "specialties")


class AppointmentType(DjangoObjectType):
    class Meta:
        model = Appointment
        fields = ("id", "date_app", "time_app", "patient_id", "doctor_id", "is_diagnosed", "diagnosis", "treatment")


class Query(UserQuery, MeQuery, graphene.ObjectType):
    doctor = graphene.Field(DoctorType, doctorId = graphene.Int(), userId = graphene.Int())
    user = graphene.Field(UserType, userId = graphene.Int())

    all_users = graphene.List(UserType)
    all_business_hours = graphene.List(BusinessHourType)
    all_doctors = graphene.List(DoctorType)
    all_appointments = graphene.List(AppointmentType)

    appointments = graphene.List(
        AppointmentType,
        dr_user_id = graphene.Int(),
        patient = graphene.Int(),
        date = graphene.Date()
    )
    past_appointments = graphene.List(
        AppointmentType,
        dr_user_id=graphene.Int(),
        patient=graphene.Int()
    )
    upcoming_appointments = graphene.List(
        AppointmentType,
        dr=graphene.Int(),
        patient=graphene.Int(),
        date=graphene.Date()
    )
    
    def resolve_doctor(self, info, **args):
        dr = args.get('doctorId')
        user = args.get('userId')
        if (dr is not None):
            return Doctor.objects.get(pk = dr)
        if (user is not None):
            return Doctor.objects.get(user_id__id=user)
        return None

    def resolve_user(self, info, **args):
        id = args.get('userId')
        if (id is not None):
            return User.objects.get(pk=id)
        return None

    def resolve_all_users(self, info):
        return User.objects.all()
    
    def resolve_all_business_hours(self, info):
        return BusinessHour.objects.all()
    
    def resolve_all_doctors(self, info):
        return Doctor.objects.all()
    
    def resolve_all_appointments(self, info):
        return Appointment.objects.all()

    def resolve_appointments(self, info, **args):
        dr = args.get('dr_user_id')
        patient = args.get('patient')
        date = args.get('date')
        if dr is not None and date is not None:
            dr_id = Doctor.objects.get(user_id__id=dr)
            return Appointment.objects.filter(doctor_id=dr_id, date_app=date)
        if dr is not None:
            dr_id = Doctor.objects.get(user_id__id=dr)
            return Appointment.objects.filter(doctor_id=dr_id, date_app=timezone.localdate())
        if patient is not None and date is not None:
            return Appointment.objects.filter(patient_id_id = patient, date_app = date)
        if patient is not None:
            return Appointment.objects.filter(patient_id_id=patient, date_app=timezone.localdate())
        return None
    
    def resolve_past_appointments(self, info, **args):
        dr = args.get('dr_user_id')
        patient = args.get('patient')
        if dr is not None:
            dr_id = Doctor.objects.get(user_id__id = dr)
            return Appointment.objects.filter(doctor_id=dr_id, date_app__lt=timezone.now())
        if patient is not None:
            return Appointment.objects.filter(patient_id_id=patient, date_app__lt=timezone.now())
        return None
    
    def resolve_upcoming_appointments(self, info, **args):
        dr = args.get('dr')
        patient = args.get('patient')
        if dr is not None and patient is not None:
            return Appointment.objects.filter(doctor_id_id=dr, patient_id_id=patient, date_app__gte=timezone.localdate())
        if dr is not None:
            return Appointment.objects.filter(doctor_id_id=dr, date_app__gte=timezone.localdate())
        if patient is not None:
            return Appointment.objects.filter(patient_id_id=patient, date_app__gte=timezone.localdate())
        return 


class CreateUser(graphene.Mutation):
    class Arguments:
        first_name = graphene.String(required = True)
        last_name = graphene.String(required = True)
        dob = graphene.Date(required = False)
    
    user = graphene.Field(UserType)
    
    @classmethod
    def mutate(cls, root, info, first_name, last_name, dob):
        user = User()
        user.first_name = first_name
        user.last_name = last_name
        user.dob = dob
        user.save()
        return CreateUser(user=user)

class CreateAppointment(graphene.Mutation):
    class Arguments:
        date = graphene.Date(required=True)
        time = graphene.Time(required=True)
        dr_user_id = graphene.Int(required=True)
        patient = graphene.Int(required=True)
    
    appointment = graphene.Field(AppointmentType)

    @classmethod
    def mutate(cls, root, info, date, time, dr_user_id, patient):
        appointment = Appointment()
        appointment.date_app = date
        appointment.time_app = time
        appointment.doctor_id = Doctor.objects.get(user_id__id=dr_user_id)
        appointment.patient_id = User.objects.get(pk=patient)
        appointment.save()
        return CreateAppointment(appointment = appointment)

class UpdateUser(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        first_name = graphene.String(required=True)
        last_name = graphene.String(required=True)
        dob = graphene.Date(required=False)
        phone = graphene.String(required=True)
        address = graphene.String(required=True)

    user = graphene.Field(UserType)

    @classmethod
    def mutate(cls, root, info, id, first_name, last_name, dob, phone, address):
        user = User.objects.get(id = id)
        user.first_name = first_name
        user.last_name = last_name
        user.dob = dob
        user.phone = phone
        user.address = address
        user.save()
        return UpdateUser(user=user)


class UpdateAppointment(graphene.Mutation):
    class Arguments:
        id = graphene.Int()
        diagnosis = graphene.String(required=True)
        treatment = graphene.String(required=True)
    
    appointment = graphene.Field(AppointmentType)

    @classmethod
    def mutate(cls, root, info, id, diagnosis, treatment):
        appointment = Appointment.objects.get(id = id)
        appointment.is_diagnosed = True
        appointment.diagnosis = diagnosis
        appointment.treatment = treatment
        appointment.save()
        return UpdateAppointment(appointment=appointment)


class DeactivateUser(graphene.Mutation):
    class Arguments:
        id = graphene.ID()

    user = graphene.Field(UserType)

    @classmethod
    def mutate(cls, root, info, id):
        user = User.objects.get(id = id)
        user.isActive = False
        user.save()
        return UpdateUser(user=user)
    

class DeleteAppointment(graphene.Mutation):
    class Arguments:
        id = graphene.Int()
    
    appointment = graphene.Field(AppointmentType)

    @classmethod
    def mutate(cls, root, info, id):
        appointment = Appointment.objects.get(pk=id)
        appointment.delete()
        return


class Mutation(AuthMutation, graphene.ObjectType):
    create_user = CreateUser.Field()
    update_user = UpdateUser.Field()
    delete_user = DeactivateUser.Field()
    create_appointment = CreateAppointment.Field()
    update_appointment = UpdateAppointment.Field()
    delete_appointment = DeleteAppointment.Field()

schema = graphene.Schema(query = Query, mutation=Mutation)
