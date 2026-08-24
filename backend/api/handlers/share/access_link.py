import os
from urllib.parse import quote
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import FileResponse
from django.conf import settings
from django.utils import timezone
from apps.files_app.model_definitions.all_models import ShareLink, File, Folder
from django.shortcuts import get_object_or_404
from core.utils.common.zip_utils import create_zip_response


class ShareLinkAccessView(APIView):
    permission_classes = []  # доступ без аутентификации

    def get(self, request, link_uuid):
        share_link = get_object_or_404(ShareLink, uuid=link_uuid)

        if share_link.is_expired():
            return Response(
                {"error": "Срок действия ссылки истёк"},
                status=status.HTTP_410_GONE
            )

        # Если запрос на скачивание (параметр download=true)
        if request.query_params.get('download') == 'true':
            # Проверка пароля для скачивания
            if share_link.password_download:
                provided_password = request.query_params.get('password')
                if not provided_password or provided_password != share_link.password_download:
                    return Response(
                        {"error": "Требуется пароль для скачивания",
                            "requires_password": True},
                        status=status.HTTP_401_UNAUTHORIZED
                    )
            # Если ссылка на файл — скачиваем файл
            if share_link.file:
                file = share_link.file
                file_path = os.path.join(settings.MEDIA_ROOT, 'users', str(
                    file.user.id), file.unique_name)
                if not os.path.exists(file_path):
                    return Response({"error": "Файл не найден на диске"}, status=status.HTTP_404_NOT_FOUND)
                response = FileResponse(
                    open(file_path, 'rb'), as_attachment=True)
                response[
                    'Content-Disposition'] = f"attachment; filename*=UTF-8''{quote(file.original_name)}"
                return response

            # Если ссылка на папку — создаём ZIP
            elif share_link.folder:
                folder = share_link.folder
                items = []
                for subfolder in Folder.objects.filter(parent=folder):
                    items.append({
                        "type": "folder",
                        "id": subfolder.id,
                        "name": subfolder.name,
                    })
                for file in File.objects.filter(folder=folder):
                    items.append({
                        "type": "file",
                        "id": file.id,
                        "name": file.original_name,
                    })

                is_empty = len(items) == 0
                if is_empty and not request.query_params.get('force_empty') == 'true':
                    return Response(
                        {"empty": True, "message": "Папка пуста"},
                        status=status.HTTP_200_OK
                    )

                # 🔍 ЛОГИРОВАНИЕ (ВРЕМЕННО) — показывает, что передаётся в утилиту
                print(
                    f"[DEBUG] Папка: '{folder.name}', items: {items}, количество элементов: {len(items)}")

                return create_zip_response(items, folder.name)
            else:
                return Response({"error": "Ссылка не привязана к объекту"}, status=status.HTTP_404_NOT_FOUND)

        # Обычный просмотр (без скачивания) — возвращаем JSON
        # Проверка пароля для просмотра
        if share_link.password_view:
            provided_password = request.query_params.get('password')
            if not provided_password or provided_password != share_link.password_view:
                return Response(
                    {"error": "Требуется пароль для просмотра",
                        "requires_password": True},
                    status=status.HTTP_401_UNAUTHORIZED
                )

        # Вычисляем оставшееся время (дни, часы, минуты)
        expires_at = share_link.expires_at
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

        # Если ссылка на файл
        if share_link.file:
            file = share_link.file
            return Response({
                "type": "file",
                "id": file.id,
                "name": file.original_name,
                "size": file.size,
                "file_type": file.file_type,
                "link_type": share_link.link_type,
                "allow_download": share_link.link_type == 'download',
                "has_password": bool(share_link.password_view),
                "requires_password_download": bool(share_link.password_download),
                "expires_at": expires_at.isoformat() if expires_at else None,
                "remaining": remaining,
            }, status=status.HTTP_200_OK)

        # Если ссылка на папку
        elif share_link.folder:
            folder = share_link.folder
            files = File.objects.filter(folder=folder)
            folders = Folder.objects.filter(parent=folder)

            items = []
            for f in folders:
                items.append({
                    "type": "folder",
                    "id": f.id,
                    "name": f.name,
                    "size": 0,
                    "created_at": f.created_at,
                })
            for f in files:
                items.append({
                    "type": "file",
                    "id": f.id,
                    "name": f.original_name,
                    "size": f.size,
                    "created_at": f.upload_date,
                })

            return Response({
                "type": "folder",
                "id": folder.id,
                "name": folder.name,
                "items": items,
                "link_type": share_link.link_type,
                "allow_download": share_link.link_type == 'download',
                "has_password": bool(share_link.password_view),
                "requires_password_download": bool(share_link.password_download),
                "expires_at": expires_at.isoformat() if expires_at else None,
                "remaining": remaining,
            }, status=status.HTTP_200_OK)

        return Response({"error": "Ссылка не привязана ни к файлу, ни к папке"}, status=status.HTTP_404_NOT_FOUND)
