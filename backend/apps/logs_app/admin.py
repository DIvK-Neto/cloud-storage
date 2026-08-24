from django.contrib import admin
from .model_definitions.all_models import AppLogEntry


@admin.register(AppLogEntry)
class AppLogEntryAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'level', 'module', 'user', 'ip', 'category')
    list_filter = ('level', 'category', 'timestamp')
    search_fields = ('message', 'module')
    readonly_fields = ('timestamp',)
