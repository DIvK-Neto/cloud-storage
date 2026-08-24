from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.accounts_app.model_definitions.all_models import CustomUser


class CheckLoginView(APIView):
    """
    Проверка, существует ли пользователь с таким логином.
    """

    def get(self, request):
        login = request.query_params.get('login')
        if not login:
            return Response(
                {'error': 'Параметр login обязателен'},
                status=status.HTTP_400_BAD_REQUEST
            )

        exists = CustomUser.objects.filter(username=login).exists()
        return Response({'exists': exists}, status=status.HTTP_200_OK)
