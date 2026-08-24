import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from apps.files_app.model_definitions.all_models import File, Folder


class TrashPermanentDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        user = request.user
        item_type = request.query_params.get('type')  # 'file' или 'folder'

        if item_type == 'file':
            try:
                item = File.objects.get(
                    id=id, user=user, deleted_at__isnull=False)
            except File.DoesNotExist:
                return Response({"error": "Файл не найден в корзине"}, status=status.HTTP_404_NOT_FOUND)

            # Физически удаляем файл с диска
            file_path = os.path.join(
                settings.MEDIA_ROOT, 'users', str(user.id), item.unique_name)
            if os.path.exists(file_path):
                os.remove(file_path)

            # Удаляем из БД
            item.delete()
            return Response({"message": "Файл удалён окончательно"}, status=status.HTTP_200_OK)

        elif item_type == 'folder':
            try:
                item = Folder.objects.get(
                    id=id, user=user, deleted_at__isnull=False)
            except Folder.DoesNotExist:
                return Response({"error": "Папка не найдена в корзине"}, status=status.HTTP_404_NOT_FOUND)

            # Рекурсивно удаляем всё содержимое
            def permanent_delete_folder(folder):
                # Удаляем файлы в этой папке
                for file_obj in File.objects.filter(folder=folder):
                    file_path = os.path.join(
                        settings.MEDIA_ROOT, 'users', str(user.id), file_obj.unique_name)
                    if os.path.exists(file_path):
                        os.remove(file_path)
                    file_obj.delete()

                # Удаляем подпапки
                for child in Folder.objects.filter(parent=folder):
                    permanent_delete_folder(child)

                # Удаляем саму папку
                folder.delete()

            permanent_delete_folder(item)
            return Response({"message": "Папка удалена окончательно"}, status=status.HTTP_200_OK)

        else:
            return Response({"error": "Неверный тип элемента"}, status=status.HTTP_400_BAD_REQUEST)
