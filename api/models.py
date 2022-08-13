from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    email = models.EmailField(blank=False, max_length=255, verbose_name="email", default="john@doe.com")
    phone = models.CharField(null=False, max_length=20, default='+504 1234 5678')
    dob = models.DateField(null=True)
    is_doctor = models.BooleanField(default=False)
    address = models.CharField(null=True, max_length=255)
    allergies = models.CharField(null=True, max_length=255)
    permanent_treatments = models.CharField(null=True, max_length=500)

    USERNAME_FIELD = "username"
    EMAIL_FIELD = "email"

    def __str__(self) -> str:
        return "id: " + str(self.id) + "; UserName: " + self.username + "; FullName: " + self.first_name + " " + self.last_name


class BusinessHour(models.Model):
    description = models.CharField(null=False, max_length=200, default='Monday to Friday')
    start_time = models.TimeField(null=False, default="08:00")
    end_time = models.TimeField(null=False, default="17:59")
    lunch_time = models.TimeField(null=True, default="12:00")
    minutes_per_appointment = models.IntegerField(null=False, default=30)

    def __str__(self) -> str:
        return "Description: " + self.description + ", " + \
            "From: " + str(self.start_time) + ", " + \
            "To: " + str(self.end_time)
            

class Doctor(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    business_hours = models.ForeignKey(BusinessHour, on_delete=models.CASCADE)
    specialties = models.CharField(null=True, max_length=500)

    def __str__(self) -> str:
        return "User: " + str(self.user_id)


class Appointment(models.Model):
    patient_id = models.ForeignKey(User, null=False, on_delete=models.CASCADE)
    doctor_id = models.ForeignKey(Doctor, null=False, on_delete=models.CASCADE)
    date_app = models.DateField()
    time_app = models.TimeField()
    is_diagnosed = models.BooleanField(default=False)
    diagnosis = models.CharField(null=True, max_length=1000)
    treatment = models.CharField(null=True, max_length=1000)

    def __str__(self) -> str:
        return "Date: " + str(self.date_app) + "; " + \
            "Time: " + str(self.time_app) + "; " + \
            "Doctor: " + str(self.doctor_id).split("; ")[1].split(": ")[1] + "; " + \
            "Patient: " + str(self.patient_id).split("; ")[1].split(": ")[1]
