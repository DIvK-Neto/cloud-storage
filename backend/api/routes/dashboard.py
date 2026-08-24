from django.urls import path
from ..handlers.dashboard.search import DashboardSearchView

urlpatterns = [
    path('dashboard/search/', DashboardSearchView.as_view(),
         name='dashboard-search'),
]
