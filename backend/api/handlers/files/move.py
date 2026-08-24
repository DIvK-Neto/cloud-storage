from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.files_app.model_definitions.all_models import File, Folder


class FileMoveView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, file_id):
        try:
            file = File.objects.get(id=file_id, user=request.user)
        except File.DoesNotExist:
            return Response({"error": "Файл не найден или у вас нет прав"}, status=status.HTTP_404_NOT_FOUND)

        new_folder_id = request.data.get('folder')
        if new_folder_id is None:
            return Response({"error": "Не указана новая папка"}, status=status.HTTP_400_BAD_REQUEST)

        if new_folder_id == 0:
            new_folder = None
        else:
            try:
                new_folder = Folder.objects.get(
                    id=new_folder_id, user=request.user)
            except Folder.DoesNotExist:
                return Response({"error": "Папка не найдена или у вас нет прав"}, status=status.HTTP_404_NOT_FOUND)

        file.folder = new_folder
        file.save()
        return Response({
            "message": "Файл перемещён",
            "new_folder": new_folder.id if new_folder else None
        }, status=status.HTTP_200_OK)
