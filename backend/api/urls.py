from django.urls import path, include
from . import views  # оставляем тестовый эндпоинт

urlpatterns = [
    path('', include('api.routes.auth')),
    path('', include('api.routes.folders')),
    path('', include('api.routes.files')),
    path('', include('api.routes.share')),
    path('', include('api.routes.comments')),
    path('', include('api.routes.admin')),
    path('', include('api.routes.health')),
    path('', include('api.routes.storage')),
    path('', include('api.routes.download')),
    path('', include('api.routes.trash')),
    path('', include('api.routes.dashboard')),
    path('', include('api.routes.status')),
]
