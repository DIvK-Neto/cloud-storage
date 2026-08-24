from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.db.models.functions import TruncMinute
from django.utils import timezone
from datetime import datetime
from apps.files_app.model_definitions.all_models import File, Folder, ShareLink
from ...serializers.all_serializers import ShareLinkSerializer


class ShareLinkCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        file_id = request.data.get('file')
        folder_id = request.data.get('folder')

        if not file_id and not folder_id:
            return Response(
                {"error": "Не указан ID файла или папки"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if file_id and folder_id:
            return Response(
                {"error": "Нельзя указать одновременно и файл, и папку"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if file_id:
            try:
                element = File.objects.get(id=file_id, user=request.user)
            except File.DoesNotExist:
                return Response(
                    {"error": "Файл не найден или у вас нет прав"},
                    status=status.HTTP_404_NOT_FOUND
                )
            filter_kwargs = {'file': element}
        else:
            try:
                element = Folder.objects.get(id=folder_id, user=request.user)
            except Folder.DoesNotExist:
                return Response(
                    {"error": "Папка не найдена или у вас нет прав"},
                    status=status.HTTP_404_NOT_FOUND
                )
            filter_kwargs = {'folder': element}

        link_type = request.data.get('link_type')
        expires_at_str = request.data.get('expires_at')
        password_view = request.data.get('password_view')
        password_download = request.data.get('password_download')
        allow_comments = request.data.get('allow_comments', False)

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

        # Проверка дубликатов
        base_filters = {
            **filter_kwargs,
            'link_type': link_type,
            'password_view': password_view,
            'password_download': password_download,
            'allow_comments': allow_comments,
        }
        active_links = ShareLink.objects.filter(**base_filters).filter(
            Q(expires_at__isnull=True) | Q(expires_at__gt=timezone.now())
        )

        if expires_at is not None:
            duplicate = active_links.annotate(
                expires_minute=TruncMinute('expires_at')
            ).filter(
                expires_minute=TruncMinute(expires_at)
            ).exists()
        else:
            duplicate = active_links.filter(expires_at__isnull=True).exists()

        if duplicate:
            return Response(
                {"error": "Ссылка с такими настройками уже существует для этого элемента. Используйте существующую ссылку или измените настройки."},
                status=status.HTTP_400_BAD_REQUEST
            )

        request.data['file'] = file_id if file_id else None
        request.data['folder'] = folder_id if folder_id else None
        request.data['expires_at'] = expires_at.isoformat(
        ) if expires_at else None

        serializer = ShareLinkSerializer(data=request.data)
        if serializer.is_valid():
            if file_id:
                serializer.save(file=element)
            else:
                serializer.save(folder=element)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
