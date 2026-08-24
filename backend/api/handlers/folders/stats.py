import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Sum
from apps.files_app.model_definitions.all_models import Folder, File


def get_file_type(filename):
    ext = os.path.splitext(filename)[1].lower()
    image_exts = {'.jpg', '.jpeg', '.png',
                  '.gif', '.webp', '.svg', '.bmp', '.ico'}
    doc_exts = {'.pdf', '.doc', '.docx', '.xls',
                '.xlsx', '.ppt', '.pptx', '.txt', '.rtf', '.odt'}
    video_exts = {'.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm'}
    audio_exts = {'.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'}
    archive_exts = {'.zip', '.rar', '.7z', '.tar', '.gz', '.bz2'}

    if ext in image_exts:
        return 'images'
    elif ext in doc_exts:
        return 'documents'
    elif ext in video_exts:
        return 'videos'
    elif ext in audio_exts:
        return 'audio'
    elif ext in archive_exts:
        return 'archives'
    else:
        return 'other'


def get_all_folders_count(folder):
    """Рекурсивно считает количество всех папок внутри (включая подпапки), только активные."""
    count = Folder.objects.filter(
        parent=folder, deleted_at__isnull=True).count()
    for child in Folder.objects.filter(parent=folder, deleted_at__isnull=True):
        count += get_all_folders_count(child)
    return count


def get_all_files_count(folder):
    """Рекурсивно считает количество всех файлов внутри (включая подпапки), только активные."""
    count = File.objects.filter(folder=folder, deleted_at__isnull=True).count()
    for child in Folder.objects.filter(parent=folder, deleted_at__isnull=True):
        count += get_all_files_count(child)
    return count


def get_total_size(folder):
    """Рекурсивно считает суммарный размер всех файлов внутри (включая подпапки), только активные."""
    total = File.objects.filter(folder=folder, deleted_at__isnull=True).aggregate(
        Sum('size'))['size__sum'] or 0
    for child in Folder.objects.filter(parent=folder, deleted_at__isnull=True):
        total += get_total_size(child)
    return total


def get_all_files_in_folder(folder):
    """Рекурсивно собирает все активные файлы в папке и подпапках."""
    files = list(File.objects.filter(folder=folder, deleted_at__isnull=True))
    for child in Folder.objects.filter(parent=folder, deleted_at__isnull=True):
        files += get_all_files_in_folder(child)
    return files


class FolderStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, folder_id):
        try:
            folder = Folder.objects.get(id=folder_id, user=request.user)
        except Folder.DoesNotExist:
            return Response({"error": "Папка не найдена"}, status=status.HTTP_404_NOT_FOUND)

        # ---- Текущая папка (прямые потомки) ----
        current_folders = Folder.objects.filter(
            parent=folder, deleted_at__isnull=True).count()
        current_files = File.objects.filter(
            folder=folder, deleted_at__isnull=True).count()
        current_size = File.objects.filter(folder=folder, deleted_at__isnull=True).aggregate(Sum('size'))[
            'size__sum'] or 0

        # ---- Все вложения (рекурсивно) ----
        total_folders = get_all_folders_count(folder)
        total_files = get_all_files_count(folder)
        total_size = get_total_size(folder)

        # ---- Типы файлов (рекурсивно) ----
        all_files = get_all_files_in_folder(folder)
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
