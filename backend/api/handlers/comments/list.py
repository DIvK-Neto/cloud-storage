from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from apps.files_app.model_definitions.all_models import GuestComment
from ...serializers.all_serializers import GuestCommentSerializer


class GuestCommentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        file_id = request.query_params.get('file_id')
        if not file_id:
            return Response({"error": "Не указан file_id"}, status=status.HTTP_400_BAD_REQUEST)
        comments = GuestComment.objects.filter(
            file_id=file_id).order_by('-created_at')
        serializer = GuestCommentSerializer(comments, many=True)
        return Response(serializer.data)
