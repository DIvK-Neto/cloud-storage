from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.files_app.model_definitions.all_models import Folder
from ...serializers.all_serializers import FolderSerializer


class FolderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        parent_id = request.query_params.get('parent')
        all_folders = request.query_params.get('all')

        # Базовая фильтрация по пользователю
        folders = Folder.objects.filter(user=user)

        # Исключаем мягко удалённые папки
        folders = folders.filter(deleted_at__isnull=True)

        # Если запрошены все папки (для дерева) — возвращаем без фильтрации по parent
        if all_folders == 'true':
            serializer = FolderSerializer(folders, many=True)
            return Response(serializer.data)

        # Иначе работаем как раньше (фильтрация по parent)
        if parent_id is not None:
            if parent_id == '' or parent_id == 'null':
                folders = folders.filter(parent__isnull=True)
            else:
                try:
                    parent_id = int(parent_id)
                    folders = folders.filter(parent_id=parent_id)
                except ValueError:
                    return Response({"error": "Неверный формат parent"}, status=400)
        else:
            # Если параметр не указан – возвращаем корневые папки (обратная совместимость)
            folders = folders.filter(parent__isnull=True)

        serializer = FolderSerializer(folders, many=True)
        return Response(serializer.data)
