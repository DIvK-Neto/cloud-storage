from django.db import models
from core.validators.common.all_validators import validate_name

full_name_field = models.CharField(
    max_length=150,
    validators=[validate_name],
    verbose_name='Полное имя'
)

