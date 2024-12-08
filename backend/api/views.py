from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = User.objects.filter(username=username).first()

        if user and user.check_password(password):
            refresh = RefreshToken.for_user(user)

            if user.is_superuser:
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'is_superuser': user.is_superuser,
                })
            
            else:
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'username': user.username,
                })

        return Response({'error': 'Invalid credentials'}, status=401)

class LogoutView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh')
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logout successfully'})
        except TokenError as e:
            return Response({'error': str(e)}, status=400)



class TokenRefreshView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        try:
            refresh = RefreshToken(refresh_token)
            new_access = refresh.access_token
            return Response({'access': str(new_access), 'refresh': str(refresh)})
        except TokenError as e:
            return Response({'error': str(e)}, status=400)
