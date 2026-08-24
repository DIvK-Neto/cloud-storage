from .tag_fields import name_field
from .folder_fields import (
    user_field,
    name_field as folder_name_field,
    description_field,
    parent_field,
    created_at_field,
    updated_at_field,
    deleted_at_field
)
from .file_fields import (
    user_field as file_user_field,
    folder_field,
    original_name_field,
    unique_name_field,
    size_field,
    file_type_field,
    comment_field,
    description_field as file_description_field,
    tags_field,
    upload_date_field,
    last_modified_date_field,
    last_download_date_field,
    views_count_field,
    downloads_count_field,
    special_link_field,
    is_public_field,
    deleted_at_field as file_deleted_at_field,
    preview_field
)
from .filehistory_fields import (
    file_field as history_file_field,
    folder_field as history_folder_field,
    changed_by_field,
    field_name_field,
    old_value_field,
    new_value_field,
    changed_at_field
)
from .sharelink_fields import (
    file_field as share_file_field,
    folder_field as share_folder_field,  # <-- ДОБАВЛЕНО
    link_type_field,
    created_at_field as share_created_at_field,
    expires_at_field,
    allowed_users_field,
    allow_comments_field
)
from .guestcomment_fields import (
    file_field as comment_file_field,
    guest_name_field,
    guest_email_field,
    content_field,
    created_at_field as comment_created_at_field
)
from .accesslog_fields import (
    file_field as log_file_field,
    user_field as log_user_field,
    ip_address_field,
    action_field,
    created_at_field as log_created_at_field
)
from .shared_collection_fields import (  # <-- ДОБАВЛЕНО
    user_field as collection_user_field,
    name_field as collection_name_field,
    uuid_field,
    created_at_field as collection_created_at_field,
    expires_at_field as collection_expires_at_field,
    allow_comments_field as collection_allow_comments_field,
    allow_download_field,
    password_field
)
