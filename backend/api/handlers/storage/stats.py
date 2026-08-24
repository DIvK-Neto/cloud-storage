from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from apps.files_app.model_definitions.all_models import Folder, File
from ..folders.stats import get_file_type


class StorageStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # ---- Текущая папка (корень) ----
        current_folders = Folder.objects.filter(
            user=user, parent__isnull=True, deleted_at__isnull=True).count()
        current_files = File.objects.filter(
            user=user, folder__isnull=True, deleted_at__isnull=True).count()
        current_size = File.objects.filter(
            user=user, folder__isnull=True, deleted_at__isnull=True).aggregate(Sum('size'))['size__sum'] or 0

        # ---- Все вложения (все папки и файлы пользователя) ----
        total_folders = Folder.objects.filter(
            user=user, deleted_at__isnull=True).count()
        total_files = File.objects.filter(
            user=user, deleted_at__isnull=True).count()
        total_size = File.objects.filter(user=user, deleted_at__isnull=True).aggregate(Sum('size'))[
            'size__sum'] or 0

        # ---- Типы файлов (все файлы пользователя) ----
        all_files = File.objects.filter(user=user, deleted_at__isnull=True)
        files_by_type = {
            'images': 0,
            'documents': 0,
            'videos': 0,
            'audio': 0,
            'archives': 0,
            'other': 0,
        }
        for f in all_files:
            file_type = get_file_type(f.original_name)
            if file_type in files_by_type:
                files_by_type[file_type] += 1
            else:
                files_by_type['other'] += 1

        return Response({
            "current_folders": current_folders,
            "current_files": current_files,
            "current_size": current_size,
            "total_folders": total_folders,
            "total_files": total_files,
            "total_size": total_size,
            "files_by_type": files_by_type,
        })
