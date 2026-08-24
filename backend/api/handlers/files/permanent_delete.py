from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
import os
from apps.files_app.model_definitions.all_models import File, ShareLink, SharedCollection


class FilePermanentDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, file_id):
        try:
            file_instance = File.objects.get(id=file_id, user=request.user)
        except File.DoesNotExist:
            return Response({"error": "Файл не найден"}, status=status.HTTP_404_NOT_FOUND)

        # Проверка на наличие активных ссылок
        if ShareLink.objects.filter(file=file_instance).exists():
            return Response({"error": "У файла есть активные ссылки. Удалите их сначала."}, status=status.HTTP_400_BAD_REQUEST)
        if SharedCollection.objects.filter(files=file_instance).exists():
            return Response({"error": "Файл используется в коллекциях. Исключите его из коллекций."}, status=status.HTTP_400_BAD_REQUEST)

        # Физическое удаление файла с диска
        file_path = os.path.join(settings.MEDIA_ROOT, 'users', str(
            request.user.id), file_instance.unique_name)
        if os.path.exists(file_path):
            os.remove(file_path)

        file_instance.delete()  # полное удаление из БД
        return Response({"message": "Файл удалён окончательно"}, status=status.HTTP_200_OK)
