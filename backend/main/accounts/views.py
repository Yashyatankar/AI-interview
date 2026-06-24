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
    def post(self, request):
        code = request.data.get('code')
        if not code:
            return Response({'error': 'Authorization code is missing'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Step A: Exchange React's auth code for a Google Access Token
            token_url = "https://oauth2.googleapis.com/token"
            token_data = {
                'code': code,
                'client_id': settings.GOOGLE_CLIENT_ID, 
                'client_secret': settings.GOOGLE_CLIENT_SECRET,                
                'redirect_uri': 'http://localhost:5173/auth/google/callback',
                'grant_type': 'authorization_code',
            }
            
            token_res = requests.post(token_url, data=token_data)
            token_res_data = token_res.json()
            
            if 'error' in token_res_data:
                return Response({'error': 'Google token exchange failed', 'details': token_res_data}, status=status.HTTP_400_BAD_REQUEST)
                
            access_token = token_res_data.get('access_token')

            # Step B: Get user details from Google using that token
            user_info_url = "https://www.googleapis.com/oauth2/v2/userinfo"
            user_info_res = requests.get(user_info_url, headers={'Authorization': f'Bearer {access_token}'})
            google_user = user_info_res.json()

            email = google_user.get('email')
            
            if not email:
                return Response({'error': 'Could not fetch email from Google'}, status=status.HTTP_400_BAD_REQUEST)


            username_suggestion = google_user.get('name', email.split('@')[0]).replace(" ", "").lower()

            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': username_suggestion,

                }
            )

            # If it's a new user and you don't want them to log in with passwords later unless they reset it:
            if created:
                user.set_unusable_password()
                user.save()

            # Step D: Put your user model through your existing Serializer!
            # Assuming your serializer generates tokens or handles JWT generation:
            serializer = RegisterSerializer(user)
            
            # If your serializer natively outputs the user data and tokens, return serializer.data
            # Otherwise, manually generate tokens using your JWT setup (e.g., SimpleJWT)
            return Response({
                'message': 'Successfully authenticated via Google',
                'user': serializer.data,
                'tokens': {
                    # If your serializer doesn't provide tokens, append your custom token logic here
                    'access': 'YOUR_GENERATED_ACCESS_JWT_TOKEN', 
                    'refresh': 'YOUR_GENERATED_REFRESH_JWT_TOKEN'
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)