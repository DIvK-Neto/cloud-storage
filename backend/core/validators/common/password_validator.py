import re
from django.core.exceptions import ValidationError


def validate_password(value):
    if len(value) < 6:
        raise ValidationError('Пароль должен содержать не менее 6 символов')
    if not re.search(r'[A-Z]', value):
        raise ValidationError(
            'Пароль должен содержать хотя бы одну заглавную букву')
    if not re.search(r'[0-9]', value):
        raise ValidationError('Пароль должен содержать хотя бы одну цифру')
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
        raise ValidationError(
            'Пароль должен содержать хотя бы один специальный символ')
