from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.files_app.model_definitions.all_models import File
from ...serializers.all_serializers import FileSerializer


class FileRenameView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, file_id):
        try:
            file_instance = File.objects.get(id=file_id, user=request.user)
        except File.DoesNotExist:
            return Response({"error": "Файл не найден или у вас нет прав"}, status=status.HTTP_404_NOT_FOUND)

        new_name = request.data.get('new_name')
        if not new_name:
            return Response({"error": "Не указано новое имя"}, status=status.HTTP_400_BAD_REQUEST)

        file_instance.original_name = new_name
        file_instance.save()
        serializer = FileSerializer(file_instance)
        return Response(serializer.data, status=status.HTTP_200_OK)
