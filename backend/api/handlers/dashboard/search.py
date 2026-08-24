from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from core.utils.common.search_utils import search_items


class DashboardSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        folder_id = request.query_params.get('folder_id')
        search = request.query_params.get('search', '')
        ordering = request.query_params.get('ordering', 'name')
        page_size = request.query_params.get('page_size', 20)

        # Параметры фильтров
        search_mode = request.query_params.get('search_mode', 'current')
        case_sensitive = request.query_params.get(
            'case_sensitive', 'false') == 'true'
        match_mode = request.query_params.get('match_mode', 'contains')
        item_type = request.query_params.get('item_type', 'all')

        items, stats = search_items(
            user=user,
            folder_id=folder_id,
            search=search,
            ordering=ordering,
            include_trash=False,
            search_mode=search_mode,
            case_sensitive=case_sensitive,
            match_mode=match_mode,
            item_type=item_type
        )

        paginator = PageNumberPagination()
        paginator.page_size = page_size
        paginator.page_query_param = 'page'
        result_page = paginator.paginate_queryset(items, request, view=self)

        response_data = paginator.get_paginated_response(result_page).data
        response_data['stats'] = stats
        return Response(response_data)
