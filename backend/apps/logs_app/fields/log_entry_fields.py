from django.db import models

timestamp_field = models.DateTimeField(
    auto_now_add=True, verbose_name='Дата и время')
level_field = models.CharField(max_length=10, verbose_name='Уровень')
module_field = models.CharField(max_length=100, verbose_name='Модуль')
message_field = models.TextField(verbose_name='Сообщение')
user_field = models.ForeignKey('accounts_app.CustomUser', on_delete=models.SET_NULL,
                               null=True, blank=True, verbose_name='Пользователь')
ip_field = models.GenericIPAddressField(
    null=True, blank=True, verbose_name='IP-адрес')
category_field = models.CharField(max_length=50, verbose_name='Категория')
