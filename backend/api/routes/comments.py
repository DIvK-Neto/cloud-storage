from django.urls import path
from ..handlers.all_handlers import GuestCommentCreateView, GuestCommentListView

urlpatterns = [
    path('comments/', GuestCommentListView.as_view(), name='comments-list'),
    path('comments/create/', GuestCommentCreateView.as_view(),
         name='comments-create'),
]
