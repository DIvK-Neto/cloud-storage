from django.contrib.auth.base_user import BaseUserManager


class CustomUserManager(BaseUserManager):
    def create_user(self, login, email, full_name, password=None, **extra_fields):
        if not login:
            raise ValueError('Логин обязателен')
        email = self.normalize_email(email)
        user = self.model(
            login=login,
            email=email,
            full_name=full_name,
            username=login,  # ← добавлено, чтобы избежать ошибки уникальности
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, login, email, full_name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_admin', True)
        return self.create_user(login, email, full_name, password, **extra_fields)
