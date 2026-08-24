from django.urls import path
from ..handlers.trash.list import TrashListView
from ..handlers.trash.restore import TrashRestoreView
from ..handlers.trash.permanent_delete import TrashPermanentDeleteView
from ..handlers.trash.clear import TrashClearView
from ..handlers.trash.count import TrashCountView

urlpatterns = [
    path('trash/', TrashListView.as_view(), name='trash-list'),
    path('trash/<int:id>/restore/',
         TrashRestoreView.as_view(), name='trash-restore'),
    path('trash/<int:id>/permanent/', TrashPermanentDeleteView.as_view(),
         name='trash-permanent-delete'),
    path('trash/clear/', TrashClearView.as_view(), name='trash-clear'),
    path('trash/count/', TrashCountView.as_view(), name='trash-count'),
]
