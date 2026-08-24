import re
from django.core.exceptions import ValidationError


def validate_login(value):
    if not re.match(r'^[A-Za-z][A-Za-z0-9]{3,19}$', value):
        raise ValidationError(
            'Логин должен начинаться с буквы, содержать только латиницу и цифры, длина от 4 до 20 символов'
        )
