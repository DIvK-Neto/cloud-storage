from rest_framework import serializers
from apps.files_app.model_definitions.all_models import File, ShareLink, SharedCollection


class FileSerializer(serializers.ModelSerializer):
    has_share_link = serializers.SerializerMethodField()
    name = serializers.CharField(
        source='original_name', read_only=True)  # <-- добавлено

    class Meta:
        model = File
        fields = [
            'id', 'original_name', 'name', 'unique_name', 'size', 'file_type',
            'comment', 'description', 'folder', 'upload_date', 'last_modified_date',
            'last_download_date', 'views_count', 'downloads_count', 'is_public',
            'preview', 'has_share_link', 'deleted_at'
        ]
        read_only_fields = ['id', 'unique_name', 'upload_date',
                            'last_modified_date', 'views_count', 'downloads_count']

    def get_has_share_link(self, obj):
        if ShareLink.objects.filter(file=obj).exists():
            return True
        if SharedCollection.objects.filter(files=obj).exists():
            return True
        return False
