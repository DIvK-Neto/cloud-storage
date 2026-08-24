import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from apps.files_app.model_definitions.all_models import ShareLink, SharedCollection
from django.core.exceptions import ObjectDoesNotExist


class ListLinksView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        item_id = request.query_params.get('item_id')
        item_type = request.query_params.get('type')  # 'file' или 'folder'

        if not item_id or not item_type:
            return Response({"error": "Не указаны item_id и type"}, status=400)

        user = request.user
        result = []
        frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:5173')

        try:
            # Отдельные ссылки
            if item_type == 'file':
                links = ShareLink.objects.filter(
                    file_id=item_id, file__user=user)
            elif item_type == 'folder':
                links = ShareLink.objects.filter(
                    folder_id=item_id, folder__user=user)
            else:
                return Response({"error": "Неверный тип"}, status=400)

            for link in links:
                result.append({
                    "id": link.id,
                    "type": "individual",
                    "link": f"{frontend_url}/shared/{link.uuid}",
                    "created_at": link.created_at.isoformat(),
                    "expires_at": link.expires_at.isoformat() if link.expires_at else None,
                    "views": 0,
                    "link_type": link.link_type,
                    "password_view": link.password_view,
                    "password_download": link.password_download,
                })

            # Коллекции (общие ссылки) — только те, в которые входит данный элемент
            if item_type == 'file':
                collections = SharedCollection.objects.filter(
                    user=user, files__id=item_id)
            elif item_type == 'folder':
                collections = SharedCollection.objects.filter(
                    user=user, folders__id=item_id)
            else:
                collections = SharedCollection.objects.none()

            for collection in collections:
                result.append({
                    "id": collection.id,
                    "type": "collection",
                    "link": f"{frontend_url}/shared/collection/{collection.uuid}",
                    "created_at": collection.created_at.isoformat(),
                    "expires_at": collection.expires_at.isoformat() if collection.expires_at else None,
                    "views": 0,
                    "link_type": collection.allow_download and 'download' or 'view',
                    "password_view": collection.password_view,
                    "password_download": collection.password_download,
                })

        except ObjectDoesNotExist:
            return Response({"error": "Элемент не найден"}, status=404)

        return Response(result)
