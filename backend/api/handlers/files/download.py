import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.http import FileResponse
from django.conf import settings
from django.utils import timezone
from apps.files_app.model_definitions.all_models import File


class FileDownloadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, file_id):
        try:
            file_instance = File.objects.get(id=file_id, user=request.user)
        except File.DoesNotExist:
            return Response({"error": "Файл не найден или у вас нет прав"}, status=status.HTTP_404_NOT_FOUND)

        file_path = os.path.join(settings.MEDIA_ROOT, 'users', str(
            request.user.id), file_instance.unique_name)
        if not os.path.exists(file_path):
            return Response({"error": "Файл на диске не найден"}, status=status.HTTP_404_NOT_FOUND)

        # Обновляем дату скачивания и счётчик
        file_instance.last_download_date = timezone.now()
        file_instance.downloads_count += 1
        file_instance.save()

        # Отдаём файл с оригинальным именем
        response = FileResponse(
            open(file_path, 'rb'), as_attachment=True, filename=file_instance.original_name)
        return response
