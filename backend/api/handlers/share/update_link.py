from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.db.models.functions import TruncMinute
from django.utils import timezone
from datetime import datetime
from apps.files_app.model_definitions.all_models import ShareLink
from ...serializers.all_serializers import ShareLinkSerializer


class UpdateLinkView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, link_id):
        try:
            link = ShareLink.objects.get(id=link_id)
        except ShareLink.DoesNotExist:
            return Response({"error": "Ссылка не найдена"}, status=status.HTTP_404_NOT_FOUND)

        if link.file and link.file.user != request.user:
            return Response({"error": "Нет прав"}, status=status.HTTP_403_FORBIDDEN)
        if link.folder and link.folder.user != request.user:
            return Response({"error": "Нет прав"}, status=status.HTTP_403_FORBIDDEN)

        # Получаем новые параметры (или текущие, если не переданы)
        new_link_type = request.data.get('link_type', link.link_type)
        new_expires_at_str = request.data.get('expires_at', link.expires_at)
        new_password_view = request.data.get(
            'password_view', link.password_view)
        new_password_download = request.data.get(
            'password_download', link.password_download)
        new_allow_comments = request.data.get(
            'allow_comments', link.allow_comments)

        # Преобразуем expires_at
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

        # --- Проверка, изменились ли настройки ---
        settings_changed = (
            new_link_type != link.link_type or
            new_expires_at != link.expires_at or
            new_password_view != link.password_view or
            new_password_download != link.password_download or
            new_allow_comments != link.allow_comments
        )

        # Если настройки не изменились — просто возвращаем успех
        if not settings_changed:
            serializer = ShareLinkSerializer(link)
            return Response(serializer.data, status=status.HTTP_200_OK)

        # --- Проверка дубликатов (с исключением текущей ссылки) ---
        element = link.file if link.file else link.folder
        element_type = 'file' if link.file else 'folder'

        base_filters = {
            element_type: element,
            'link_type': new_link_type,
            'password_view': new_password_view,
            'password_download': new_password_download,
            'allow_comments': new_allow_comments,
        }
        active_links = ShareLink.objects.filter(**base_filters).filter(
            Q(expires_at__isnull=True) | Q(expires_at__gt=timezone.now())
        ).exclude(id=link_id)

        if new_expires_at is not None:
            duplicate = active_links.annotate(
                expires_minute=TruncMinute('expires_at')
            ).filter(
                expires_minute=TruncMinute(new_expires_at)
            ).exists()
        else:
            duplicate = active_links.filter(expires_at__isnull=True).exists()

        if duplicate:
            return Response(
                {"error": "Ссылка с такими настройками уже существует для этого элемента. Используйте существующую ссылку или измените настройки."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # --- Обновление ---
        request.data['expires_at'] = new_expires_at.isoformat(
        ) if new_expires_at else None
        serializer = ShareLinkSerializer(link, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, link_id):
        try:
            link = ShareLink.objects.get(id=link_id)
        except ShareLink.DoesNotExist:
            return Response({"error": "Ссылка не найдена"}, status=status.HTTP_404_NOT_FOUND)

        if link.file and link.file.user != request.user:
            return Response({"error": "Нет прав"}, status=status.HTTP_403_FORBIDDEN)
        if link.folder and link.folder.user != request.user:
            return Response({"error": "Нет прав"}, status=status.HTTP_403_FORBIDDEN)

        link.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
