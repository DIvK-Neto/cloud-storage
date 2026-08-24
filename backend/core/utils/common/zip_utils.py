import io
import os
import zipfile
import logging
from urllib.parse import quote
from django.conf import settings
from django.http import HttpResponse
from apps.files_app.model_definitions.all_models import File, Folder

logger = logging.getLogger(__name__)


def create_zip_response(items, zip_name):
    """
    Создаёт ZIP-архив из списка элементов и возвращает HttpResponse.
    """
    logger.info(f"[ZIP UTILS] zip_name received: '{zip_name}'")

    zip_buffer = io.BytesIO()

    def add_file_to_zip(zip_file, file_obj, arcname):
        file_path = os.path.join(settings.MEDIA_ROOT, 'users', str(
            file_obj.user.id), file_obj.unique_name)
        if os.path.exists(file_path):
            zip_file.write(file_path, arcname=arcname)

    def collect_files_from_folder(folder, current_path=''):
        collected = []
        for f in File.objects.filter(folder=folder):
            collected.append((f, os.path.join(current_path, f.original_name)))
        for subfolder in Folder.objects.filter(parent=folder):
            collected.extend(collect_files_from_folder(
                subfolder, os.path.join(current_path, subfolder.name)))
        return collected

    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        for item in items:
            if item['type'] == 'file':
                try:
                    file_obj = File.objects.get(id=item['id'])
                    add_file_to_zip(zip_file, file_obj, item['name'])
                except File.DoesNotExist:
                    continue
            elif item['type'] == 'folder':
                try:
                    folder_obj = Folder.objects.get(id=item['id'])
                    files_to_add = collect_files_from_folder(
                        folder_obj, item['name'])
                    for f, arcname in files_to_add:
                        add_file_to_zip(zip_file, f, arcname)
                except Folder.DoesNotExist:
                    continue

    zip_buffer.seek(0)
    response = HttpResponse(zip_buffer.getvalue(),
                            content_type='application/zip')
    encoded_name = quote(zip_name)
    logger.info(
        f"[ZIP UTILS] encoded_name: '{encoded_name}', final filename: '{zip_name}.zip'")
    # Поменяли порядок: сначала filename*=, потом filename
    response['Content-Disposition'] = f"attachment; filename*=UTF-8''{encoded_name}.zip; filename=\"{zip_name}.zip\""
    return response
