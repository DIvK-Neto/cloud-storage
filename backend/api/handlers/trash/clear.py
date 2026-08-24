import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from apps.files_app.model_definitions.all_models import File, Folder


class TrashClearView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user

        # Получаем все мягко удалённые элементы пользователя
        files = File.objects.filter(user=user, deleted_at__isnull=False)
        folders = Folder.objects.filter(user=user, deleted_at__isnull=False)

        # Физически удаляем файлы с диска
        for file_obj in files:
            file_path = os.path.join(
                settings.MEDIA_ROOT, 'users', str(user.id), file_obj.unique_name)
            if os.path.exists(file_path):
                os.remove(file_path)

        # Удаляем файлы из БД
        files.delete()

        # Удаляем папки (каскадно, все вложенные элементы уже удалены)
        folders.delete()

        return Response({"message": "Корзина очищена"}, status=status.HTTP_200_OK)
