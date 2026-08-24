from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login
from ...serializers.all_serializers import LoginSerializer


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                request,
                username=serializer.validated_data['login'],
                password=serializer.validated_data['password']
            )
            if user is not None:
                login(request, user)
                return Response({
                    "message": "Вход выполнен успешно",
                    "user": {
                        "login": user.login,
                        "full_name": user.full_name,
                        "email": user.email,
                        "is_admin": user.is_admin,
                    }
                }, status=status.HTTP_200_OK)
            return Response({"error": "Неверный логин или пароль"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
