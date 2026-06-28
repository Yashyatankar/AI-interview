from django.urls import path
from .views import userDetail

urlpatterns = [
   path('auth/me/', userDetail)
]
