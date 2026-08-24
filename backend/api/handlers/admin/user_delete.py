import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from apps.accounts_app.model_definitions.all_models import CustomUser
from apps.files_app.model_definitions.all_models import File


class AdminUserDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, user_id):
        if not request.user.is_admin:
            return Response({"error": "Доступ запрещён. Требуются права администратора."}, status=status.HTTP_403_FORBIDDEN)

        if request.user.id == user_id:
            return Response({"error": "Нельзя удалить самого себя"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({"error": "Пользователь не найден"}, status=status.HTTP_404_NOT_FOUND)

        # Удаляем файлы пользователя с диска
        files = File.objects.filter(user=user)
        for file in files:
            file_path = os.path.join(
                settings.MEDIA_ROOT, 'users', str(user.id), file.unique_name)
            if os.path.exists(file_path):
                os.remove(file_path)
            file.delete()

        # Удаляем пользователя
        user.delete()
        return Response({"message": "Пользователь удалён"}, status=status.HTTP_200_OK)
