from django.db import models

storage_path_field = models.CharField(
    max_length=255,
    blank=True,
    null=True,
    verbose_name='Путь к хранилищу'
)
