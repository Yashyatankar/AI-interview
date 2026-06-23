from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class List_display(admin.ModelAdmin):
    list_display = ['username', 'email']

    

admin.site.register(User, UserAdmin)