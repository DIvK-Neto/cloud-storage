from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from apps.files_app.model_definitions.all_models import File, GuestComment
from ...serializers.all_serializers import GuestCommentSerializer


class GuestCommentCreateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = GuestCommentSerializer(data=request.data)
        if serializer.is_valid():
            file_id = request.data.get('file')
            if not File.objects.filter(id=file_id).exists():
                return Response({"error": "Файл не найден"}, status=status.HTTP_404_NOT_FOUND)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
