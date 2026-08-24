from django.contrib import admin
from .model_definitions.all_models import Tag, Folder, File, FileHistory, ShareLink, GuestComment, AccessLog

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)


@admin.register(Folder)
class FolderAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'parent', 'created_at')
    search_fields = ('name', 'user__login')
    list_filter = ('user',)


@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ('original_name', 'user', 'folder',
                    'size', 'upload_date', 'is_public')
    search_fields = ('original_name', 'user__login')
    list_filter = ('user', 'file_type', 'is_public')


@admin.register(FileHistory)
class FileHistoryAdmin(admin.ModelAdmin):
    list_display = ('file', 'folder', 'field_name', 'changed_by', 'changed_at')
    search_fields = ('file__original_name',
                     'folder__name', 'changed_by__login')


@admin.register(ShareLink)
class ShareLinkAdmin(admin.ModelAdmin):
    list_display = ('file', 'link_type', 'created_at',
                    'expires_at', 'allow_comments')
    search_fields = ('file__original_name',)


@admin.register(GuestComment)
class GuestCommentAdmin(admin.ModelAdmin):
    list_display = ('file', 'guest_name', 'created_at')
    search_fields = ('file__original_name', 'guest_name')


@admin.register(AccessLog)
class AccessLogAdmin(admin.ModelAdmin):
    list_display = ('file', 'user', 'action', 'ip_address', 'created_at')
    search_fields = ('file__original_name', 'user__login', 'ip_address')
    list_filter = ('action',)
