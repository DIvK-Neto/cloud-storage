from django.db import models
from ..fields.all_fields import (
    comment_file_field,
    guest_name_field,
    guest_email_field,
    content_field,
    comment_created_at_field
)


class GuestComment(models.Model):
    file = comment_file_field
    guest_name = guest_name_field
    guest_email = guest_email_field
    content = content_field
    created_at = comment_created_at_field

    def __str__(self):
        return f"Комментарий от {self.guest_name} к {self.file.original_name}"
