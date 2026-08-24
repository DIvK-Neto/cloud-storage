from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from datetime import datetime
from apps.files_app.model_definitions.all_models import SharedCollection
from ...serializers.all_serializers import SharedCollectionSerializer


class UpdateCollectionView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, collection_id):
        try:
            collection = SharedCollection.objects.get(
                id=collection_id, user=request.user)
        except SharedCollection.DoesNotExist:
            return Response({"error": "Коллекция не найдена"}, status=status.HTTP_404_NOT_FOUND)

        # Получаем новые параметры (или текущие, если не переданы)
        new_items = request.data.get('items')
        new_allow_download = request.data.get(
            'allow_download', collection.allow_download)
        new_expires_at_str = request.data.get(
            'expires_at', collection.expires_at)
        new_password_view = request.data.get(
            'password_view', collection.password_view)
        new_password_download = request.data.get(
            'password_download', collection.password_download)

        new_expires_at = None
        if new_expires_at_str:
            try:
                new_expires_at = datetime.fromisoformat(
                    new_expires_at_str.replace('Z', '+00:00'))
            except ValueError:
                return Response(
                    {"error": "Неверный формат expires_at"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Определяем состав элементов (новый или текущий)
        if new_items is not None:
            files = collection.files.filter(id__in=new_items)
            folders = collection.folders.filter(id__in=new_items)
            files_ids = set(files.values_list('id', flat=True))
            folders_ids = set(folders.values_list('id', flat=True))
        else:
            files_ids = set(collection.files.values_list('id', flat=True))
            folders_ids = set(collection.folders.values_list('id', flat=True))

        # --- Проверка на дубликат при обновлении (с округлением до минут) ---
        base_filters = {
            'user': request.user,
            'allow_download': new_allow_download,
            'password_view': new_password_view,
            'password_download': new_password_download,
        }
        existing_collections = SharedCollection.objects.filter(
            **base_filters).exclude(id=collection_id)

        duplicate_found = False
        for existing in existing_collections:
            existing_files = set(existing.files.values_list('id', flat=True))
            existing_folders = set(
                existing.folders.values_list('id', flat=True))
            if existing_files != files_ids or existing_folders != folders_ids:
                continue

            # Сравниваем expires_at с округлением до минут
            if new_expires_at is None:
                if existing.expires_at is None:
                    duplicate_found = True
                    break
            else:
                if existing.expires_at is not None:
                    existing_rounded = existing.expires_at.replace(
                        second=0, microsecond=0)
                    new_rounded = new_expires_at.replace(
                        second=0, microsecond=0)
                    if existing_rounded == new_rounded:
                        duplicate_found = True
                        break

        if duplicate_found:
            return Response(
                {"error": "Коллекция с такими элементами уже существует. Используйте существующую ссылку или измените набор элементов."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = SharedCollectionSerializer(
            collection, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, collection_id):
        try:
            collection = SharedCollection.objects.get(
                id=collection_id, user=request.user)
        except SharedCollection.DoesNotExist:
            return Response({"error": "Коллекция не найдена"}, status=status.HTTP_404_NOT_FOUND)

        collection.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
