from django.db import models
from core.mixins.common.all_mixins import SoftDeleteMixin, TimestampMixin, TreeMixin
from ..fields.all_fields import (
    user_field,
    folder_name_field,
    description_field,
    parent_field,
    created_at_field,
    updated_at_field,
    deleted_at_field
)


class Folder(SoftDeleteMixin, TimestampMixin, models.Model):
    user = user_field
    name = folder_name_field
    description = description_field
    parent = parent_field

    created_at = created_at_field
    updated_at = updated_at_field
    deleted_at = deleted_at_field

    class Meta:
        unique_together = ['user', 'name', 'parent']
        verbose_name = 'Папка'
        verbose_name_plural = 'Папки'

    def __str__(self):
        return f"{self.name} ({self.user.login})"
