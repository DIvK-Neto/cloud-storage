from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.files_app.model_definitions.all_models import Folder


class FolderMoveView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, folder_id):
        try:
            folder = Folder.objects.get(id=folder_id, user=request.user)
        except Folder.DoesNotExist:
            return Response({"error": "Папка не найдена или у вас нет прав"}, status=status.HTTP_404_NOT_FOUND)

        new_parent_id = request.data.get('parent')
        if new_parent_id is None:
            return Response({"error": "Не указан новый родитель"}, status=status.HTTP_400_BAD_REQUEST)

        if new_parent_id == 0:
            new_parent = None
        else:
            try:
                new_parent = Folder.objects.get(
                    id=new_parent_id, user=request.user)
            except Folder.DoesNotExist:
                return Response({"error": "Родительская папка не найдена или у вас нет прав"}, status=status.HTTP_404_NOT_FOUND)

            # Проверяем, не пытаемся ли переместить папку в себя или в свою дочернюю
            if new_parent == folder:
                return Response({"error": "Нельзя переместить папку в саму себя"}, status=status.HTTP_400_BAD_REQUEST)

            # Проверка на цикл (parent -> folder)
            current = new_parent
            while current:
                if current == folder:
                    return Response({"error": "Нельзя переместить папку в свою дочернюю папку"}, status=status.HTTP_400_BAD_REQUEST)
                current = current.parent

        folder.parent = new_parent
        folder.save()
        return Response({"message": "Папка перемещена", "new_parent": new_parent.id if new_parent else None}, status=status.HTTP_200_OK)
