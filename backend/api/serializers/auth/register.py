from rest_framework import serializers
from apps.accounts_app.model_definitions.all_models import CustomUser
from core.validators.common.all_validators import validate_login, validate_name, validate_password


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, validators=[validate_password])
    full_name = serializers.CharField(validators=[validate_name])
    login = serializers.CharField(validators=[validate_login])

    class Meta:
        model = CustomUser
        fields = ['login', 'full_name', 'email', 'password']

    def validate_login(self, value):
        if CustomUser.objects.filter(login=value).exists():
            raise serializers.ValidationError(
                "Пользователь с таким логином уже существует")
        return value

    def validate_email(self, value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Пользователь с таким email уже существует")
        return value

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            login=validated_data['login'],
            email=validated_data['email'],
            full_name=validated_data['full_name'],
            password=validated_data['password']
        )
        return user
