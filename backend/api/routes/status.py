from django.urls import path
from ..handlers.status.check_delete_status import CheckDeleteStatusView

urlpatterns = [
    path('status/check-delete/', CheckDeleteStatusView.as_view(),
         name='check-delete-status'),
]
