import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.files_app.model_definitions.all_models import Folder, File
from core.utils.common.zip_utils import create_zip_response

logger = logging.getLogger(__name__)


class FolderDownloadView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, folder_id):
        try:
            folder = Folder.objects.get(id=folder_id, user=request.user)
        except Folder.DoesNotExist:
            return Response(
                {"error": "Папка не найдена или у вас нет прав"},
                status=status.HTTP_404_NOT_FOUND
            )

        logger.info(
            f"[FOLDER DOWNLOAD] folder_id={folder_id}, folder_name='{folder.name}'")

        items = []
        subfolders = Folder.objects.filter(parent=folder)
        for sub in subfolders:
            items.append({
                "type": "folder",
                "id": sub.id,
                "name": sub.name,
            })

        files = File.objects.filter(folder=folder)
        for f in files:
            items.append({
                "type": "file",
                "id": f.id,
                "name": f.original_name,
            })

        logger.info(
            f"[FOLDER DOWNLOAD] items count={len(items)}, zip_name='{folder.name}'")

        return create_zip_response(items, folder.name)
