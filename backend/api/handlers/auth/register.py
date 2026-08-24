from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth import login  # <-- ДОБАВЛЕНО
from ...serializers.all_serializers import UserRegistrationSerializer


class RegisterView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Автоматически логиним пользователя на бэкенде (создаём сессию)
            login(request, user)
            return Response({
                "message": "Пользователь успешно зарегистрирован",
                "user": {
                    "login": user.login,
                    "full_name": user.full_name,
                    "email": user.email,
                    "is_admin": user.is_admin,
                }
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
