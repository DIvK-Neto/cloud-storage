from django.db import models
from core.validators.common.all_validators import validate_login

login_field = models.CharField(
    max_length=20,
    unique=True,
    validators=[validate_login],
    verbose_name='Логин'
)
