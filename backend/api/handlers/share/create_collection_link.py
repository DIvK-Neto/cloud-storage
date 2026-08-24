from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from datetime import datetime
from apps.files_app.model_definitions.all_models import SharedCollection, File, Folder
from ...serializers.all_serializers import SharedCollectionSerializer
import logging

logger = logging.getLogger(__name__)


class CreateCollectionLinkView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        item_ids = request.data.get('items', [])
        if not item_ids:
            return Response(
                {"error": "Не указаны элементы для коллекции"},
                status=status.HTTP_400_BAD_REQUEST
            )

        logger.info(f"[COLLECTION CREATE] item_ids: {item_ids}")

        files = File.objects.filter(id__in=item_ids, user=user)
        folders = Folder.objects.filter(id__in=item_ids, user=user)

        found_ids = list(files.values_list('id', flat=True)) + \
            list(folders.values_list('id', flat=True))
        if set(item_ids) != set(found_ids):
            return Response(
                {"error": "Некоторые элементы не найдены или не принадлежат вам"},
                status=status.HTTP_404_NOT_FOUND
            )

        expires_at_str = request.data.get('expires_at')
        allow_download = request.data.get('allow_download', False)
        password_view = request.data.get('password_view')
        password_download = request.data.get('password_download')

        logger.info(f"[COLLECTION CREATE] expires_at_str: {expires_at_str}")
        logger.info(f"[COLLECTION CREATE] allow_download: {allow_download}")
        logger.info(f"[COLLECTION CREATE] password_view: {password_view}")
        logger.info(
            f"[COLLECTION CREATE] password_download: {password_download}")

        expires_at = None
        if expires_at_str:
            try:
                expires_at = datetime.fromisoformat(
                    expires_at_str.replace('Z', '+00:00'))
            except ValueError:
                return Response(
                    {"error": "Неверный формат expires_at"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        files_ids = set(files.values_list('id', flat=True))
        folders_ids = set(folders.values_list('id', flat=True))

        logger.info(f"[COLLECTION CREATE] files_ids: {files_ids}")
        logger.info(f"[COLLECTION CREATE] folders_ids: {folders_ids}")

        # Проверка дубликатов
        base_filters = {
            'user': user,
            'allow_download': allow_download,
            'password_view': password_view,
            'password_download': password_download,
        }
        existing_collections = SharedCollection.objects.filter(**base_filters)

        logger.info(
            f"[COLLECTION CREATE] existing_collections count: {existing_collections.count()}")

        duplicate_found = False
        for collection in existing_collections:
            collection_files = set(
                collection.files.values_list('id', flat=True))
            collection_folders = set(
                collection.folders.values_list('id', flat=True))
            logger.info(
                f"[COLLECTION CREATE] comparing with collection {collection.id}, files: {collection_files}, folders: {collection_folders}")
            if collection_files != files_ids or collection_folders != folders_ids:
                continue

            # Сравниваем expires_at
            if expires_at is None:
                if collection.expires_at is None:
                    duplicate_found = True
                    logger.info(
                        f"[COLLECTION CREATE] duplicate found (both null expires_at)")
                    break
            else:
                if collection.expires_at is not None:
                    coll_rounded = collection.expires_at.replace(
                        second=0, microsecond=0)
                    new_rounded = expires_at.replace(second=0, microsecond=0)
                    if coll_rounded == new_rounded:
                        duplicate_found = True
                        logger.info(
                            f"[COLLECTION CREATE] duplicate found (expires_at rounded match: {coll_rounded} == {new_rounded})")
                        break

        if duplicate_found:
            return Response(
                {"error": "Коллекция с такими элементами уже существует. Используйте существующую ссылку или измените набор элементов."},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():
            serializer = SharedCollectionSerializer(data=request.data)
            if serializer.is_valid():
                collection = serializer.save(user=user)
                if files.exists():
                    collection.files.set(files)
                if folders.exists():
                    collection.folders.set(folders)
                logger.info(
                    f"[COLLECTION CREATE] collection created: {collection.id}")
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
