from django.contrib import admin
from .model_definitions.all_models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('login', 'full_name', 'email', 'is_admin')
    search_fields = ('login', 'full_name', 'email')
    list_filter = ('is_admin',)
