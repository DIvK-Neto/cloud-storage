from django.db import models
from ..fields.all_fields import timestamp_field, level_field, module_field, message_field, user_field, ip_field, category_field


class AppLogEntry(models.Model):
    timestamp = timestamp_field
    level = level_field
    module = module_field
    message = message_field
    user = user_field
    ip = ip_field
    category = category_field

    def __str__(self):
        return f"{self.timestamp} [{self.level}] {self.module}: {self.message[:50]}"
