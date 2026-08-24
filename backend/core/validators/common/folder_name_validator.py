import re
from django.core.exceptions import ValidationError


def validate_folder_name(value):
    if not value or not value.strip():
        raise ValidationError('Имя папки не может быть пустым')
    if len(value) > 100:
        raise ValidationError('Имя папки не может быть длиннее 100 символов')
    if re.search(r'[\\/:*?"<>|]', value):
        raise ValidationError(
            'Имя папки не должно содержать спецсимволы: \\ / : * ? " < > |')
