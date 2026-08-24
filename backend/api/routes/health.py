from django.urls import path
from ..handlers.all_handlers import HealthCheckView

urlpatterns = [
    path('health/', HealthCheckView.as_view(), name='health-check'),
]
