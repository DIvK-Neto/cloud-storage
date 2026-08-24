from rest_framework import serializers
from apps.files_app.model_definitions.all_models import Folder


class FileUploadSerializer(serializers.Serializer):
    comment = serializers.CharField(required=False, allow_blank=True)
    description = serializers.CharField(required=False, allow_blank=True)
    folder = serializers.PrimaryKeyRelatedField(
        queryset=Folder.objects.all(), required=False, allow_null=True)
