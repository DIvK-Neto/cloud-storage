from django.db import models
from django.utils import timezone
from core.mixins.common.all_mixins import SoftDeleteMixin, TimestampMixin
from ..fields.all_fields import (
    file_user_field,
    folder_field,
    original_name_field,
    unique_name_field,
    size_field,
    file_type_field,
    comment_field,
    file_description_field,
    tags_field,
    upload_date_field,
    last_modified_date_field,
    last_download_date_field,
    views_count_field,
    downloads_count_field,
    special_link_field,
    is_public_field,
    deleted_at_field,
    preview_field
)


class File(SoftDeleteMixin, TimestampMixin, models.Model):
    user = file_user_field
    folder = folder_field
    original_name = original_name_field
    unique_name = unique_name_field
    size = size_field
    file_type = file_type_field
    comment = comment_field
    description = file_description_field
    tags = tags_field
    upload_date = upload_date_field
    last_modified_date = last_modified_date_field
    last_download_date = last_download_date_field
    views_count = views_count_field
    downloads_count = downloads_count_field
    special_link = special_link_field
    is_public = is_public_field
    deleted_at = deleted_at_field
    preview = preview_field

    def __str__(self):
        return self.original_name

    def increment_views(self):
        self.views_count += 1
        self.save()

    def increment_downloads(self):
        self.downloads_count += 1
        self.last_download_date = timezone.now()
        self.save()
