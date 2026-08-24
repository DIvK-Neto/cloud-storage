import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from apps.files_app.model_definitions.all_models import File, Folder
from core.utils.common.zip_utils import create_zip_response

logger = logging.getLogger(__name__)


class DownloadBulkView(APIView):
    permission_classes = [IsAuthenticated]

    def _get_items(self, items_ids):
        user = self.request.user
        items = []
        for item_id in items_ids:
            file_obj = File.objects.filter(id=item_id, user=user).first()
            if file_obj:
                items.append({
                    "type": "file",
                    "id": file_obj.id,
                    "name": file_obj.original_name,
                })
                continue
            folder_obj = Folder.objects.filter(id=item_id, user=user).first()
            if folder_obj:
                items.append({
                    "type": "folder",
                    "id": folder_obj.id,
                    "name": folder_obj.name,
                })
                continue
            return None, f"Элемент с id {item_id} не найден или у вас нет прав"
        return items, None

    def post(self, request):
        items_ids = request.data.get('items', [])
        if not items_ids:
            return Response(
                {"error": "Не указаны элементы для скачивания"},
                status=status.HTTP_400_BAD_REQUEST
            )
        items, error = self._get_items(items_ids)
        if error:
            return Response({"error": error}, status=status.HTTP_404_NOT_FOUND)

        archive_name = request.data.get(
            'name', f"Archive_{timezone.now().strftime('%Y-%m-%d')}")
        return create_zip_response(items, archive_name)

    def get(self, request):
        items_ids_str = request.query_params.get('items', '')
        if not items_ids_str:
            return Response(
                {"error": "Не указаны элементы для скачивания"},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            items_ids = [int(x) for x in items_ids_str.split(',') if x]
        except ValueError:
            return Response(
                {"error": "Неверный формат списка элементов"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if not items_ids:
            return Response(
                {"error": "Не указаны элементы для скачивания"},
                status=status.HTTP_400_BAD_REQUEST
            )
        items, error = self._get_items(items_ids)
        if error:
            return Response({"error": error}, status=status.HTTP_404_NOT_FOUND)

        archive_name = request.query_params.get(
            'name', f"Archive_{timezone.now().strftime('%Y-%m-%d')}")
        return create_zip_response(items, archive_name)
