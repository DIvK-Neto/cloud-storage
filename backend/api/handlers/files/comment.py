from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.files_app.model_definitions.all_models import File
from ...serializers.all_serializers import FileSerializer


class FileCommentView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, file_id):
        try:
            file = File.objects.get(id=file_id, user=request.user)
        except File.DoesNotExist:
            return Response({"error": "Файл не найден или у вас нет прав"}, status=status.HTTP_404_NOT_FOUND)

        new_comment = request.data.get('comment')
        if new_comment is None:
            return Response({"error": "Поле 'comment' обязательно"}, status=status.HTTP_400_BAD_REQUEST)

        file.comment = new_comment
        file.save()
        serializer = FileSerializer(file)
        return Response(serializer.data, status=status.HTTP_200_OK)
