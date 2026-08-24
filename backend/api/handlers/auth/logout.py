from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import logout


class LogoutView(APIView):
    def post(self, request):
        logout(request)
        return Response({"message": "Вы вышли из системы"}, status=status.HTTP_200_OK)
