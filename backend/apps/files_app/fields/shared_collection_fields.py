from django.db import models
import uuid

user_field = models.ForeignKey(
    'accounts_app.CustomUser',
    on_delete=models.CASCADE,
    verbose_name='Владелец'
)

name_field = models.CharField(
    max_length=255,
    default='Коллекция',
    verbose_name='Название коллекции'
)

uuid_field = models.UUIDField(
    default=uuid.uuid4,
    editable=False,
    unique=True,
    verbose_name='Уникальный идентификатор'
)

created_at_field = models.DateTimeField(
    auto_now_add=True,
    verbose_name='Дата создания'
)

expires_at_field = models.DateTimeField(
    null=True,
    blank=True,
    verbose_name='Дата истечения'
)

allow_comments_field = models.BooleanField(
    default=False,
    verbose_name='Разрешить комментарии'
)

allow_download_field = models.BooleanField(
    default=True,
    verbose_name='Разрешить скачивание'
)

password_field = models.CharField(
    max_length=128,
    blank=True,
    null=True,
    verbose_name='Пароль (хеш)'
)
