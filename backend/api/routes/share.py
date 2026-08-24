from django.urls import path
from ..handlers.all_handlers import (
    ShareLinkCreateView,
    ShareLinkAccessView,
    CreateCollectionLinkView,
    AccessCollectionLinkView,
    ListLinksView,
    UpdateLinkView,
    UpdateCollectionView,  # <-- ДОБАВЛЕНО
)

urlpatterns = [
    path('share/create/', ShareLinkCreateView.as_view(), name='share-create'),
    path('share/<uuid:link_uuid>/',
         ShareLinkAccessView.as_view(), name='share-access'),
    path('share/create-collection/', CreateCollectionLinkView.as_view(),
         name='share-create-collection'),
    path('share/collection/<uuid:collection_uuid>/',
         AccessCollectionLinkView.as_view(), name='share-access-collection'),
    path('share/links/', ListLinksView.as_view(), name='share-links'),
    path('share/update/<int:link_id>/',
         UpdateLinkView.as_view(), name='share-update'),
    path('share/update-collection/<int:collection_id>/',
         UpdateCollectionView.as_view(), name='share-update-collection'),  # <-- ДОБАВЛЕНО
]
