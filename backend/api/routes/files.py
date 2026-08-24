from django.urls import path
from ..handlers.all_handlers import (
    FileListView,
    FileUploadView,
    FileDeleteView,
    FileRenameView,
    FileDownloadView,
    FileMoveView,
    FileCommentView,
)
# Добавляем импорт для permanent delete
from ..handlers.files.permanent_delete import FilePermanentDeleteView

urlpatterns = [
    path('files/', FileListView.as_view(), name='files'),
    path('files/upload/', FileUploadView.as_view(), name='file-upload'),
    path('files/<int:file_id>/delete/',
         FileDeleteView.as_view(), name='file-delete'),
    path('files/<int:file_id>/rename/',
         FileRenameView.as_view(), name='file-rename'),
    path('files/<int:file_id>/download/',
         FileDownloadView.as_view(), name='file-download'),
    path('files/<int:file_id>/move/', FileMoveView.as_view(), name='file-move'),
    path('files/<int:file_id>/comment/',
         FileCommentView.as_view(), name='file-comment'),
    # Добавлен маршрут для окончательного удаления
    path('files/<int:file_id>/permanent-delete/',
         FilePermanentDeleteView.as_view(), name='file-permanent-delete'),
]
