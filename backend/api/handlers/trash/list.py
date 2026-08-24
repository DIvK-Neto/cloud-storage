from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from core.utils.common.search_utils import search_items
from ...serializers.all_serializers import FileSerializer, FolderSerializer


class TrashListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        search = request.query_params.get('search', '')
        ordering = request.query_params.get('ordering', '-deleted_at')
        item_type = request.query_params.get('type')
        page_size = request.query_params.get('page_size', 20)

        items, stats = search_items(
            user=user,
            folder_id=None,
            search=search,
            ordering=ordering,
            include_trash=True
        )

        if item_type == 'files':
            items = [item for item in items if item['type'] == 'file']
        elif item_type == 'folders':
            items = [item for item in items if item['type'] == 'folder']

        # Пересчёт статистики после фильтрации по типу
        if item_type in ('files', 'folders'):
            total_folders = sum(
                1 for item in items if item['type'] == 'folder')
            total_files = sum(1 for item in items if item['type'] == 'file')
            total_size = sum(item.get('size', 0) for item in items)
            files_by_type = {'images': 0, 'documents': 0,
                             'videos': 0, 'audio': 0, 'archives': 0, 'other': 0}
            from core.utils.common.search_utils import get_file_type
            for item in items:
                if item['type'] == 'file':
                    ftype = get_file_type(item.get('name', ''))
                    files_by_type[ftype] += 1
            stats = {
                'current_folders': total_folders,
                'current_files': total_files,
                'current_size': total_size,
                'total_folders': total_folders,
                'total_files': total_files,
                'total_size': total_size,
                'files_by_type': files_by_type,
            }

        paginator = PageNumberPagination()
        paginator.page_size = page_size
        paginator.page_query_param = 'page'
        result_page = paginator.paginate_queryset(items, request, view=self)

        response_data = paginator.get_paginated_response(result_page).data
        response_data['stats'] = stats
        return Response(response_data)
