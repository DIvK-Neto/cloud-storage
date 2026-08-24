import uuid
from django.db import models
from django.utils import timezone


class SharedCollection(models.Model):
    user = models.ForeignKey(
        'accounts_app.CustomUser',
        on_delete=models.CASCADE,
        verbose_name='Владелец'
    )
    name = models.CharField(
        max_length=255,
        default='Коллекция',
        verbose_name='Название коллекции'
    )
    uuid = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        unique=True,
        verbose_name='Уникальный идентификатор'
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Дата создания'
    )
    expires_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name='Дата истечения'
    )
    allow_comments = models.BooleanField(
        default=False,
        verbose_name='Разрешить комментарии'
    )
    allow_download = models.BooleanField(
        default=True,
        verbose_name='Разрешить скачивание'
    )
    password = models.CharField(
        max_length=128,
        blank=True,
        null=True,
        verbose_name='Пароль (хеш)'
    )
    password_view = models.CharField(
        max_length=128,
        blank=True,
        null=True,
        verbose_name='Пароль для просмотра (хеш)'
    )
    password_download = models.CharField(
        max_length=128,
        blank=True,
        null=True,
        verbose_name='Пароль для скачивания (хеш)'
    )

    # ManyToMany связи с файлами и папками
    files = models.ManyToManyField(
        'File',
        blank=True,
        verbose_name='Файлы в коллекции'
    )
    folders = models.ManyToManyField(
        'Folder',
        blank=True,
        verbose_name='Папки в коллекции'
    )

    def is_expired(self):
        return self.expires_at and self.expires_at < timezone.now()

    def __str__(self):
        return f"Коллекция {self.name} ({self.uuid})"
