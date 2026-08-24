from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.files_app.model_definitions.all_models import File, Folder


class TrashRestoreView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        user = request.user
        item_type = request.query_params.get('type')  # 'file' или 'folder'

        if item_type == 'file':
            try:
                item = File.objects.get(
                    id=id, user=user, deleted_at__isnull=False)
            except File.DoesNotExist:
                return Response({"error": "Файл не найден в корзине"}, status=status.HTTP_404_NOT_FOUND)
        elif item_type == 'folder':
            try:
                item = Folder.objects.get(
                    id=id, user=user, deleted_at__isnull=False)
            except Folder.DoesNotExist:
                return Response({"error": "Папка не найдена в корзине"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"error": "Неверный тип элемента"}, status=status.HTTP_400_BAD_REQUEST)

        # Восстанавливаем элемент
        item.restore()

        # Если это папка, восстанавливаем все вложенные элементы (рекурсивно)
        if item_type == 'folder':
            # Восстанавливаем все файлы в этой папке и подпапках
            def restore_folder_contents(folder):
                for child in Folder.objects.filter(parent=folder, deleted_at__isnull=False):
                    child.restore()
                    restore_folder_contents(child)
                for file_obj in File.objects.filter(folder=folder, deleted_at__isnull=False):
                    file_obj.restore()

            restore_folder_contents(item)

        return Response({"message": "Элемент восстановлен"}, status=status.HTTP_200_OK)
