from django.db import models
from core.validators.common.folder_name_validator import validate_folder_name

user_field = models.ForeignKey(
    'accounts_app.CustomUser',
    on_delete=models.CASCADE,
    verbose_name='Владелец'
)

name_field = models.CharField(
    max_length=100,
    validators=[validate_folder_name],
    verbose_name='Название папки'
)

description_field = models.TextField(
    blank=True,
    null=True,
    verbose_name='Описание папки'
)

parent_field = models.ForeignKey(
    'self',
    on_delete=models.CASCADE,
    null=True,
    blank=True,
    verbose_name='Родительская папка'
)

created_at_field = models.DateTimeField(
    auto_now_add=True,
    verbose_name='Дата создания'
)

updated_at_field = models.DateTimeField(
    auto_now=True,
    verbose_name='Дата обновления'
)

deleted_at_field = models.DateTimeField(
    null=True,
    blank=True,
    verbose_name='Дата удаления'
)
