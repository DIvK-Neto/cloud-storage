from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.files_app.model_definitions.all_models import Folder
from ...serializers.all_serializers import FolderSerializer


class FolderCommentView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, folder_id):
        try:
            folder = Folder.objects.get(id=folder_id, user=request.user)
        except Folder.DoesNotExist:
            return Response({"error": "Папка не найдена или у вас нет прав"}, status=status.HTTP_404_NOT_FOUND)

        new_description = request.data.get('description')
        if new_description is None:
            return Response({"error": "Поле 'description' обязательно"}, status=status.HTTP_400_BAD_REQUEST)

        folder.description = new_description
        folder.save()
        serializer = FolderSerializer(folder)
        return Response(serializer.data, status=status.HTTP_200_OK)
