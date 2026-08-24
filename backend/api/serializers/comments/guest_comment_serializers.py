from rest_framework import serializers
from apps.files_app.model_definitions.all_models import GuestComment


class GuestCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = GuestComment
        fields = ['id', 'file', 'guest_name',
                  'guest_email', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']
