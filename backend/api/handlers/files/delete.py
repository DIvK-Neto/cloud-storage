import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from apps.files_app.model_definitions.all_models import File


class FileDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, file_id):
        try:
            file_instance = File.objects.get(id=file_id, user=request.user)
        except File.DoesNotExist:
            return Response({"error": "Файл не найден или у вас нет прав"}, status=status.HTTP_404_NOT_FOUND)

        # Мягкое удаление (помещаем в корзину)
        file_instance.soft_delete()

        # Физически файл с диска не удаляем, чтобы можно было восстановить.
        # При окончательном удалении из корзины файл будет удалён физически.

        return Response({"message": "Файл перемещён в корзину"}, status=status.HTTP_200_OK)
