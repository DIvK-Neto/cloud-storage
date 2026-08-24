from rest_framework import serializers
from django.utils import timezone
from apps.files_app.model_definitions.all_models import SharedCollection


class SharedCollectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SharedCollection
        fields = [
            'id', 'uuid', 'user', 'name', 'created_at', 'expires_at',
            'allow_comments', 'allow_download', 'password',
            'password_view', 'password_download'
        ]
        read_only_fields = ['id', 'uuid', 'created_at', 'user']

    def validate_expires_at(self, value):
        if value and value <= timezone.now():
            raise serializers.ValidationError(
                "Дата истечения должна быть в будущем")
        return value
