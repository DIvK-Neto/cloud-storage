from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class HealthCheckView(APIView):
    permission_classes = []  # Доступ без аутентификации

    def get(self, request):
        return Response({"message": "Hello from Django!"}, status=status.HTTP_200_OK)
