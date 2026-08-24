from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
import os
from apps.files_app.model_definitions.all_models import Folder, File, ShareLink, SharedCollection


class FolderPermanentDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, folder_id):
        try:
            folder = Folder.objects.get(id=folder_id, user=request.user)
        except Folder.DoesNotExist:
            return Response({"error": "Папка не найдена"}, status=status.HTTP_404_NOT_FOUND)

        # Проверка на наличие ссылок (рекурсивно на все вложенные элементы)
        def has_links(folder_obj):
            if ShareLink.objects.filter(folder=folder_obj).exists():
                return True
            if SharedCollection.objects.filter(folders=folder_obj).exists():
                return True
            for f in File.objects.filter(folder=folder_obj):
                if ShareLink.objects.filter(file=f).exists() or SharedCollection.objects.filter(files=f).exists():
                    return True
            for child in Folder.objects.filter(parent=folder_obj):
                if has_links(child):
                    return True
            return False

        if has_links(folder):
            return Response({"error": "Папка или её содержимое имеет активные ссылки или используется в коллекциях."}, status=status.HTTP_400_BAD_REQUEST)

        # Рекурсивное физическое удаление
        def permanent_delete_folder(folder_obj):
            for f in File.objects.filter(folder=folder_obj):
                file_path = os.path.join(settings.MEDIA_ROOT, 'users', str(
                    request.user.id), f.unique_name)
                if os.path.exists(file_path):
                    os.remove(file_path)
                f.delete()
            for child in Folder.objects.filter(parent=folder_obj):
                permanent_delete_folder(child)
            folder_obj.delete()

        permanent_delete_folder(folder)
        return Response({"message": "Папка удалена окончательно"}, status=status.HTTP_200_OK)
