from django.db import models
from ..fields.all_fields import name_field


class Tag(models.Model):
    name = name_field

    def __str__(self):
        return self.name
