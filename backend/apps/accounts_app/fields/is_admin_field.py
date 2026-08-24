from django.db import models

is_admin_field = models.BooleanField(
    default=False,
    verbose_name='Администратор'
)
