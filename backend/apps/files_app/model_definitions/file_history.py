from django.db import models
from ..fields.all_fields import (
    history_file_field,
    history_folder_field,
    changed_by_field,
    field_name_field,
    old_value_field,
    new_value_field,
    changed_at_field
)


class FileHistory(models.Model):
    file = history_file_field
    folder = history_folder_field
    changed_by = changed_by_field
    field_name = field_name_field
    old_value = old_value_field
    new_value = new_value_field
    changed_at = changed_at_field

    def __str__(self):
        return f"Изменение {self.field_name} для {self.file or self.folder}"
