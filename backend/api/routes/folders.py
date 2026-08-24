from django.urls import path
from ..handlers.all_handlers import (
    FolderListView,
    FolderCreateView,
    FolderDeleteView,
    FolderRenameView,
    FolderMoveView,
    FolderPathView,
    FolderStatsView,
    FolderCommentView,
    FolderDownloadView,
)
# Добавляем импорт для permanent delete
from ..handlers.folders.permanent_delete import FolderPermanentDeleteView

urlpatterns = [
    path('folders/', FolderListView.as_view(), name='folders'),
    path('folders/create/', FolderCreateView.as_view(), name='folder-create'),
    path('folders/<int:folder_id>/delete/',
         FolderDeleteView.as_view(), name='folder-delete'),
    path('folders/<int:folder_id>/rename/',
         FolderRenameView.as_view(), name='folder-rename'),
    path('folders/<int:folder_id>/move/',
         FolderMoveView.as_view(), name='folder-move'),
    path('folders/<int:folder_id>/path/',
         FolderPathView.as_view(), name='folder-path'),
    path('folders/<int:folder_id>/stats/',
         FolderStatsView.as_view(), name='folder-stats'),
    path('folders/<int:folder_id>/comment/',
         FolderCommentView.as_view(), name='folder-comment'),
    path('folders/<int:folder_id>/download-folder/',
         FolderDownloadView.as_view(), name='folder-download'),
    # Добавлен маршрут для окончательного удаления
    path('folders/<int:folder_id>/permanent-delete/',
         FolderPermanentDeleteView.as_view(), name='folder-permanent-delete'),
]
