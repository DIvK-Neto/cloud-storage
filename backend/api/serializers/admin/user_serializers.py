from rest_framework import serializers
from django.db.models import Sum, Count
from apps.accounts_app.model_definitions.all_models import CustomUser
from apps.files_app.model_definitions.all_models import File


class AdminUserSerializer(serializers.ModelSerializer):
    files_count = serializers.SerializerMethodField()
    total_size = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ['id', 'login', 'full_name', 'email',
                  'is_admin', 'files_count', 'total_size']

    def get_files_count(self, obj):
        return File.objects.filter(user=obj).count()

    def get_total_size(self, obj):
        return File.objects.filter(user=obj).aggregate(total=Sum('size'))['total'] or 0
