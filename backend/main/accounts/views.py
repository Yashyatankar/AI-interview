from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, LoginSerializer
from django.conf import settings
import requests
from django.contrib.auth import get_user_model


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            tokens = get_tokens_for_user(user)
            return Response({
                'message': 'Account created successfully',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                },
                'tokens': tokens
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user']
            tokens = get_tokens_for_user(user)
            return Response({
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                },
                'tokens': tokens
            }, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
        }, status=status.HTTP_200_OK)





User = get_user_model()


class GoogleLoginCallbackView(APIView):
    permission_classes = []

    def post(self, request):
        code = request.data.get('code')
        if not code:
            return Response({'error': 'Authorization code missing'}, status=status.HTTP_400_BAD_REQUEST)

        # Step 1: Exchange code for Google access token
        token_res = requests.post('https://oauth2.googleapis.com/token', data={
            'code': code,
            'client_id': settings.GOOGLE_CLIENT_ID,
            'client_secret': settings.GOOGLE_CLIENT_SECRET,
            'redirect_uri': 'http://localhost:5173/auth/google/callback',
            'grant_type': 'authorization_code',
        })
        token_data = token_res.json()

        if 'error' in token_data:
            return Response({'error': 'Google token exchange failed', 'details': token_data}, status=status.HTTP_400_BAD_REQUEST)

        # Step 2: Fetch user info from Google
        user_info_res = requests.get(
            'https://www.googleapis.com/oauth2/v2/userinfo',
            headers={'Authorization': f'Bearer {token_data["access_token"]}'}
        )
        google_user = user_info_res.json()

        email = google_user.get('email')
        if not email:
            return Response({'error': 'Could not retrieve email from Google'}, status=status.HTTP_400_BAD_REQUEST)

        # Step 3: Get or create user
        username = google_user.get('name', email.split('@')[0]).replace(' ', '').lower()
        user, created = User.objects.get_or_create(
            email=email,
            defaults={'username': username}
        )
        if created:
            user.set_unusable_password()
            user.save()

        # Step 4: Issue JWT tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'Google login successful',
            'user': {'id': user.id, 'username': user.username, 'email': user.email},
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_200_OK)


class GithubLoginCallbackView(APIView):
    permission_classes = []

    def post(self, request):
        code = request.data.get('code')
        if not code:
            return Response({'error': 'Authorization code missing'}, status=status.HTTP_400_BAD_REQUEST)

        # Step 1: Exchange code for GitHub access token
        token_res = requests.post(
            'https://github.com/login/oauth/access_token',
            data={
                'code': code,
                'client_id': settings.GITHUB_CLIENT_ID,
                'client_secret': settings.GITHUB_CLIENT_SECRET,
                'redirect_uri': 'http://localhost:5173/auth/github/callback',
            },
            headers={'Accept': 'application/json'}
        )
        token_data = token_res.json()

        if 'error' in token_data:
            return Response({'error': 'GitHub token exchange failed', 'details': token_data}, status=status.HTTP_400_BAD_REQUEST)

        access_token = token_data.get('access_token')

        # Step 2: Fetch GitHub user profile
        user_info_res = requests.get(
            'https://api.github.com/user',
            headers={'Authorization': f'Bearer {access_token}'}
        )
        github_user = user_info_res.json()

        # Step 3: Fetch email (GitHub may not return email in /user if it's private)
        email = github_user.get('email')
        if not email:
            emails_res = requests.get(
                'https://api.github.com/user/emails',
                headers={'Authorization': f'Bearer {access_token}'}
            )
            emails = emails_res.json()
            # Pick the primary verified email
            primary = next((e for e in emails if e.get('primary') and e.get('verified')), None)
            if not primary:
                return Response({'error': 'Could not retrieve a verified email from GitHub'}, status=status.HTTP_400_BAD_REQUEST)
            email = primary['email']

        # Step 4: Get or create user
        username = (github_user.get('login') or email.split('@')[0]).lower()
        user, created = User.objects.get_or_create(
            email=email,
            defaults={'username': username}
        )
        if created:
            user.set_unusable_password()
            user.save()

        # Step 5: Issue JWT tokens
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'GitHub login successful',
            'user': {'id': user.id, 'username': user.username, 'email': user.email},
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            }
        }, status=status.HTTP_200_OK)