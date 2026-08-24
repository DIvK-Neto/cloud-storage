from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.files_app.model_definitions.all_models import File, Folder


class TrashCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        file_count = File.objects.filter(
            user=user, deleted_at__isnull=False).count()
        folder_count = Folder.objects.filter(
            user=user, deleted_at__isnull=False).count()

        return Response({
            "total": file_count + folder_count,
            "files": file_count,
            "folders": folder_count,
        })
