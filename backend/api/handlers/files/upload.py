import os
import uuid
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.conf import settings
from apps.files_app.model_definitions.all_models import File
from ...serializers.all_serializers import FileUploadSerializer, FileSerializer


def generate_unique_filename(original_name):
    ext = os.path.splitext(original_name)[1]
    return f"{uuid.uuid4().hex}{ext}"


class FileUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = FileUploadSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        uploaded_file = request.FILES.get('file')
        if not uploaded_file:
            return Response({"error": "Файл не передан"}, status=status.HTTP_400_BAD_REQUEST)

        unique_name = generate_unique_filename(uploaded_file.name)
        user_folder = os.path.join(
            settings.MEDIA_ROOT, 'users', str(request.user.id))
        os.makedirs(user_folder, exist_ok=True)

        file_path = os.path.join(user_folder, unique_name)
        with open(file_path, 'wb+') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)

        # Создаём запись в БД
        file_instance = File(
            user=request.user,
            original_name=uploaded_file.name,
            unique_name=unique_name,
            size=uploaded_file.size,
            file_type=uploaded_file.content_type,
            comment=serializer.validated_data.get('comment', ''),
            description=serializer.validated_data.get('description', ''),
            folder=serializer.validated_data.get('folder'),
            special_link=uuid.uuid4().hex,  # уникальный идентификатор
        )
        file_instance.save()

        response_serializer = FileSerializer(file_instance)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
