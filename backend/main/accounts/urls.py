from django.urls import path
from .views import RegisterView, LoginView, LogoutView, UserView, GithubLoginCallbackView, GoogleLoginCallbackView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', UserView.as_view(), name='user'),
    path('auth/google/callback/', GoogleLoginCallbackView.as_view()),
    path('auth/github/callback/', GithubLoginCallbackView.as_view()),
]