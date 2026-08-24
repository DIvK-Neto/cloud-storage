from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from apps.files_app.model_definitions.all_models import Folder


class FolderPathView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, folder_id):
        try:
            folder = Folder.objects.get(id=folder_id, user=request.user)
        except Folder.DoesNotExist:
            return Response({"error": "Папка не найдена"}, status=status.HTTP_404_NOT_FOUND)

        path = []
        current = folder
        while current:
            path.append({"id": current.id, "name": current.name})
            current = current.parent
        path.reverse()  # от корня к текущей
        return Response(path, status=status.HTTP_200_OK)
