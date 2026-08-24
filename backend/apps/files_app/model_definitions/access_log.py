from django.db import models
from ..fields.all_fields import (
    log_file_field,
    log_user_field,
    ip_address_field,
    action_field,
    log_created_at_field
)


class AccessLog(models.Model):
    file = log_file_field
    user = log_user_field
    ip_address = ip_address_field
    action = action_field
    created_at = log_created_at_field

    def __str__(self):
        return f"{self.action} {self.file.original_name} от {self.created_at}"
