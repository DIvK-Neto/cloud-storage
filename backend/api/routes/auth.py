from django.urls import path
from ..handlers.all_handlers import RegisterView, LoginView, LogoutView, CheckLoginView, CheckEmailView, CurrentUserView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('check-login/', CheckLoginView.as_view(), name='check-login'),
    path('check-email/', CheckEmailView.as_view(), name='check-email'),
    path('user/', CurrentUserView.as_view(), name='current-user'),
]
