from django.db import models

file_field = models.ForeignKey(
    'File', on_delete=models.CASCADE, verbose_name='Файл')
user_field = models.ForeignKey('accounts_app.CustomUser', on_delete=models.SET_NULL,
                               null=True, blank=True, verbose_name='Пользователь')
ip_address_field = models.GenericIPAddressField(verbose_name='IP-адрес')
action_field = models.CharField(
    max_length=20,
    choices=[('view', 'Просмотр'), ('download', 'Скачивание'),
             ('share_open', 'Открытие по ссылке')],
    verbose_name='Действие'
)
created_at_field = models.DateTimeField(
    auto_now_add=True, verbose_name='Дата и время')
