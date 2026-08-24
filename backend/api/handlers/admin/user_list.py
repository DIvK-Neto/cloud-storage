from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from apps.accounts_app.model_definitions.all_models import CustomUser
from ...serializers.all_serializers import AdminUserSerializer


class AdminUserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_admin:
            return Response({"error": "Доступ запрещён. Требуются права администратора."}, status=status.HTTP_403_FORBIDDEN)

        users = CustomUser.objects.all()
        serializer = AdminUserSerializer(users, many=True)
        return Response(serializer.data)
