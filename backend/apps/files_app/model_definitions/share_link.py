import uuid
from django.db import models
from django.utils import timezone


class ShareLink(models.Model):
    file = models.ForeignKey(
        'File', on_delete=models.CASCADE, verbose_name='Файл', null=True, blank=True
    )
    folder = models.ForeignKey(
        'Folder', on_delete=models.CASCADE, verbose_name='Папка', null=True, blank=True
    )
    link_type = models.CharField(
        max_length=10,
        choices=[('view', 'Просмотр'), ('download', 'Скачивание')],
        verbose_name='Тип ссылки'
    )
    created_at = models.DateTimeField(
        auto_now_add=True, verbose_name='Дата создания')
    expires_at = models.DateTimeField(
        null=True, blank=True, verbose_name='Дата истечения')
    allowed_users = models.ManyToManyField(
        'accounts_app.CustomUser', blank=True, verbose_name='Разрешённые пользователи')
    allow_comments = models.BooleanField(
        default=False, verbose_name='Разрешить комментарии')
    password = models.CharField(
        max_length=128, blank=True, null=True, verbose_name='Пароль (хеш)')
    password_view = models.CharField(
        max_length=128, blank=True, null=True, verbose_name='Пароль для просмотра (хеш)')
    password_download = models.CharField(
        max_length=128, blank=True, null=True, verbose_name='Пароль для скачивания (хеш)')
    uuid = models.UUIDField(default=uuid.uuid4, editable=False,
                            unique=True, verbose_name='Уникальный идентификатор')

    def is_expired(self):
        return self.expires_at and self.expires_at < timezone.now()

    def __str__(self):
        if self.file:
            return f"Ссылка на файл {self.file.original_name} ({self.link_type})"
        elif self.folder:
            return f"Ссылка на папку {self.folder.name} ({self.link_type})"
        return "Ссылка (без объекта)"
