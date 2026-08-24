from django.db import models

name_field = models.CharField(
    max_length=50,
    unique=True,
    verbose_name='Название тега'
)
