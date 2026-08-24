from django.core.exceptions import ValidationError


def validate_name(value):
    if not value or not value.strip():
        raise ValidationError('Имя не может быть пустым')
    if not all(c.isalpha() or c.isspace() for c in value):
        raise ValidationError('Имя должно содержать только буквы и пробелы')
