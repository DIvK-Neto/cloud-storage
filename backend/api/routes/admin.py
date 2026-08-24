from django.urls import path
from ..handlers.all_handlers import AdminUserListView, AdminUserDeleteView, AdminUserToggleAdminView

urlpatterns = [
    path('admin/users/', AdminUserListView.as_view(), name='admin-users'),
    path('admin/users/<int:user_id>/delete/',
         AdminUserDeleteView.as_view(), name='admin-user-delete'),
    path('admin/users/<int:user_id>/toggle-admin/',
         AdminUserToggleAdminView.as_view(), name='admin-user-toggle-admin'),
]
