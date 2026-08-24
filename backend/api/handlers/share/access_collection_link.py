from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.utils import timezone
from apps.files_app.model_definitions.all_models import SharedCollection
from core.utils.common.zip_utils import create_zip_response


class AccessCollectionLinkView(APIView):
    permission_classes = []  # доступ без аутентификации

    def get(self, request, collection_uuid):
        collection = get_object_or_404(SharedCollection, uuid=collection_uuid)

        if collection.is_expired():
            return Response(
                {"error": "Срок действия ссылки истёк"},
                status=status.HTTP_410_GONE
            )

        # Если запрос на скачивание (параметр download=true)
        if request.query_params.get('download') == 'true':
            # Проверка пароля для скачивания
            if collection.password_download:
                provided_password = request.query_params.get('password')
                if not provided_password or provided_password != collection.password_download:
                    return Response(
                        {"error": "Требуется пароль для скачивания",
                            "requires_password": True},
                        status=status.HTTP_401_UNAUTHORIZED
                    )

            # Формируем список элементов коллекции
            items = []
            for folder in collection.folders.all():
                items.append({
                    "type": "folder",
                    "id": folder.id,
                    "name": folder.name,
                })
            for file in collection.files.all():
                items.append({
                    "type": "file",
                    "id": file.id,
                    "name": file.original_name,
                })

            is_empty = len(items) == 0
            if is_empty and not request.query_params.get('force_empty') == 'true':
                return Response(
                    {"empty": True, "message": "Коллекция пуста"},
                    status=status.HTTP_200_OK
                )

            return create_zip_response(items, collection.name)

        # Обычный просмотр
        # Проверка пароля для просмотра
        if collection.password_view:
            provided_password = request.query_params.get('password')
            if not provided_password or provided_password != collection.password_view:
                return Response(
                    {"error": "Требуется пароль для просмотра",
                        "requires_password": True},
                    status=status.HTTP_401_UNAUTHORIZED
                )

        # Вычисляем оставшееся время (дни, часы, минуты)
        expires_at = collection.expires_at
        remaining = None
        if expires_at:
            diff = expires_at - timezone.now()
            if diff.total_seconds() <= 0:
                remaining = "Истекла"
            else:
                days = diff.days
                hours = diff.seconds // 3600
                minutes = (diff.seconds % 3600) // 60
                parts = []
                if days > 0:
                    parts.append(f"{days} дн.")
                if hours > 0:
                    parts.append(f"{hours} ч.")
                if minutes > 0:
                    parts.append(f"{minutes} мин.")
                remaining = " ".join(parts) if parts else "0 мин."
        else:
            remaining = "Бессрочно"

        # Формируем список элементов коллекции
        items = []

        # Добавляем папки
        for folder in collection.folders.all():
            items.append({
                "type": "folder",
                "id": folder.id,
                "name": folder.name,
                "size": 0,
                "created_at": folder.created_at.isoformat(),
            })

        # Добавляем файлы
        for file in collection.files.all():
            items.append({
                "type": "file",
                "id": file.id,
                "name": file.original_name,
                "size": file.size,
                "created_at": file.upload_date.isoformat(),
                "file_type": file.file_type,
            })

        return Response({
            "type": "collection",
            "uuid": collection.uuid,
            "name": collection.name,
            "expires_at": expires_at.isoformat() if expires_at else None,
            "remaining": remaining,
            "allow_download": collection.allow_download,
            "allow_comments": collection.allow_comments,
            "has_password": bool(collection.password_view),
            "requires_password_download": bool(collection.password_download),
            "items": items,
        }, status=status.HTTP_200_OK)
