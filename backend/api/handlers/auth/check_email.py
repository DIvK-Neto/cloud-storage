from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.accounts_app.model_definitions.all_models import CustomUser


class CheckEmailView(APIView):
    """
    Проверка, существует ли пользователь с таким email.
    """

    def get(self, request):
        email = request.query_params.get('email')
        if not email:
            return Response(
                {'error': 'Параметр email обязателен'},
                status=status.HTTP_400_BAD_REQUEST
            )

        exists = CustomUser.objects.filter(email=email).exists()
        return Response({'exists': exists}, status=status.HTTP_200_OK)
