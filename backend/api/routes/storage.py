from django.urls import path
from ..handlers.all_handlers import StorageStatsView

urlpatterns = [
    path('storage/stats/', StorageStatsView.as_view(), name='storage-stats'),
]
