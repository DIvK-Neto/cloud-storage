from django.contrib.auth.models import AbstractUser
from ..fields.all_fields import full_name_field, login_field, is_admin_field, storage_path_field
from core.managers.accounts_specific.all_managers import CustomUserManager


class CustomUser(AbstractUser):
    full_name = full_name_field
    login = login_field
    is_admin = is_admin_field
    storage_path = storage_path_field

    objects = CustomUserManager()

    USERNAME_FIELD = 'login'
    REQUIRED_FIELDS = ['full_name', 'email']

    def __str__(self):
        return self.login
