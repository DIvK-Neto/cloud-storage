from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.accounts_app.model_definitions.all_models import CustomUser


class AdminUserToggleAdminView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, user_id):
        if not request.user.is_admin:
            return Response({"error": "Доступ запрещён. Требуются права администратора."}, status=status.HTTP_403_FORBIDDEN)

        if request.user.id == user_id:
            return Response({"error": "Нельзя изменить свой собственный статус администратора"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({"error": "Пользователь не найден"}, status=status.HTTP_404_NOT_FOUND)

        user.is_admin = not user.is_admin
        user.save()
        return Response({
            "message": f"Статус администратора изменён на {user.is_admin}",
            "is_admin": user.is_admin
        }, status=status.HTTP_200_OK)
