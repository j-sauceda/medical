from django.contrib import admin
from .models import User, BusinessHour, Doctor, Appointment
from django.apps import apps

# Register your models here.
admin.site.register(User)
admin.site.register(BusinessHour)
admin.site.register(Doctor)
admin.site.register(Appointment)

app = apps.get_app_config('graphql_auth')
for model_name, model in app.models.items():
    admin.site.register(model)