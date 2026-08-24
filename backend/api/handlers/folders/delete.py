from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.files_app.model_definitions.all_models import Folder, File


class FolderDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, folder_id):
        try:
            folder = Folder.objects.get(id=folder_id, user=request.user)
        except Folder.DoesNotExist:
            return Response({"error": "Папка не найдена или у вас нет прав"}, status=status.HTTP_404_NOT_FOUND)

        # Рекурсивное мягкое удаление
        def soft_delete_folder(folder_obj):
            # Сначала обрабатываем дочерние папки
            for child in Folder.objects.filter(parent=folder_obj):
                soft_delete_folder(child)
            # Затем файлы в этой папке
            for file_obj in File.objects.filter(folder=folder_obj):
                file_obj.soft_delete()
            # И саму папку
            folder_obj.soft_delete()

        soft_delete_folder(folder)

        return Response({"message": "Папка перемещена в корзину"}, status=status.HTTP_200_OK)
