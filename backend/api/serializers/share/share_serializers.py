from rest_framework import serializers
from django.utils import timezone
from apps.files_app.model_definitions.all_models import ShareLink


class ShareLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShareLink
        fields = ['id', 'uuid', 'file', 'folder', 'link_type', 'created_at',
                  'expires_at', 'allowed_users', 'allow_comments',
                  'password_view', 'password_download']
        read_only_fields = ['id', 'uuid', 'created_at']

    def validate(self, data):
        # Если это обновление (PATCH), не требуем file или folder
        if self.instance:
            return data

        file = data.get('file')
        folder = data.get('folder')
        if not file and not folder:
            raise serializers.ValidationError(
                "Необходимо указать либо файл, либо папку")
        if file and folder:
            raise serializers.ValidationError(
                "Нельзя указать одновременно и файл, и папку")
        return data

    def validate_expires_at(self, value):
        if value and value <= timezone.now():
            raise serializers.ValidationError(
                "Дата истечения должна быть в будущем")
        return value
