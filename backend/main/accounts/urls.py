from django.urls import path
from .views import RegisterView, LoginView, LogoutView, UserView, GithubLoginCallbackView, GoogleLoginCallbackView
from rest_framework_simplejwt.views import TokenRefreshView,  TokenVerifyView
urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', UserView.as_view(), name='user'),
    path('token/access/',  TokenVerifyView.as_view(), name='token_access'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/google/callback/', GoogleLoginCallbackView.as_view()),
    path('auth/github/callback/', GithubLoginCallbackView.as_view()),
]