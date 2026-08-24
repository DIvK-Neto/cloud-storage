from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.files_app.model_definitions.all_models import Folder


class FolderRenameView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, folder_id):
        try:
            folder = Folder.objects.get(id=folder_id, user=request.user)
        except Folder.DoesNotExist:
            return Response({"error": "Папка не найдена или у вас нет прав"}, status=status.HTTP_404_NOT_FOUND)

        new_name = request.data.get('name')
        if not new_name:
            return Response({"error": "Новое имя папки не указано"}, status=status.HTTP_400_BAD_REQUEST)

        if Folder.objects.filter(user=request.user, name=new_name, parent=folder.parent).exists():
            return Response({"error": "Папка с таким именем уже существует"}, status=status.HTTP_400_BAD_REQUEST)

        folder.name = new_name
        folder.save()
        return Response({"message": "Папка переименована", "new_name": folder.name}, status=status.HTTP_200_OK)
