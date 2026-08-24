from django.urls import path
from ..handlers.all_handlers import DownloadBulkView

urlpatterns = [
    path('download/bulk/', DownloadBulkView.as_view(), name='download-bulk'),
]
