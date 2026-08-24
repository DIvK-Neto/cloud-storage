from rest_framework import serializers
from django.db.models import Sum
from apps.files_app.model_definitions.all_models import Folder, File, ShareLink, SharedCollection


class FolderSerializer(serializers.ModelSerializer):
    total_folders_count = serializers.SerializerMethodField()
    total_files_count = serializers.SerializerMethodField()
    total_size = serializers.SerializerMethodField()
    has_share_link = serializers.SerializerMethodField()

    class Meta:
        model = Folder
        fields = [
            'id', 'name', 'description', 'parent', 'created_at', 'updated_at',
            'total_folders_count', 'total_files_count', 'total_size',
            'has_share_link', 'deleted_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_total_folders_count(self, obj):
        def count_subfolders(folder):
            children = Folder.objects.filter(parent=folder)
            count = children.count()
            for child in children:
                count += count_subfolders(child)
            return count
        return count_subfolders(obj)

    def get_total_files_count(self, obj):
        def count_files(folder):
            files = File.objects.filter(folder=folder).count()
            children = Folder.objects.filter(parent=folder)
            for child in children:
                files += count_files(child)
            return files
        return count_files(obj)

    def get_total_size(self, obj):
        def sum_size(folder):
            total = File.objects.filter(folder=folder).aggregate(
                Sum('size'))['size__sum'] or 0
            children = Folder.objects.filter(parent=folder)
            for child in children:
                total += sum_size(child)
            return total
        return sum_size(obj)

    def get_has_share_link(self, obj):
        # Проверяем наличие прямой ссылки
        if ShareLink.objects.filter(folder=obj).exists():
            return True
        # Проверяем, входит ли папка в какую-либо коллекцию
        if SharedCollection.objects.filter(folders=obj).exists():
            return True
        return False
