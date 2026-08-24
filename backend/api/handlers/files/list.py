from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import get_user_model
from apps.files_app.model_definitions.all_models import File
from ...serializers.all_serializers import FileSerializer

User = get_user_model()


class FileListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_id = request.query_params.get('user_id')
        folder_id = request.query_params.get('folder')

        if user.is_admin and user_id:
            try:
                target_user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                return Response({"error": "Пользователь не найден"}, status=404)
            files = File.objects.filter(user=target_user)
        else:
            files = File.objects.filter(user=user)

        # Исключаем мягко удалённые файлы
        files = files.filter(deleted_at__isnull=True)

        # Фильтрация по папке
        if folder_id is not None:
            if folder_id == '0' or folder_id == 'null':
                files = files.filter(folder__isnull=True)
            else:
                try:
                    folder_id = int(folder_id)
                    files = files.filter(folder_id=folder_id)
                except ValueError:
                    return Response({"error": "Неверный формат folder"}, status=400)
        else:
            files = files.filter(folder__isnull=True)

        serializer = FileSerializer(files, many=True)
        return Response(serializer.data)
