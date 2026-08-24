from django.db import models

user_field = models.ForeignKey(
    'accounts_app.CustomUser', on_delete=models.CASCADE, verbose_name='Владелец')
folder_field = models.ForeignKey(
    'Folder', on_delete=models.SET_NULL, null=True, blank=True, verbose_name='Папка')
original_name_field = models.CharField(
    max_length=255, verbose_name='Оригинальное имя')
unique_name_field = models.CharField(
    max_length=255, unique=True, verbose_name='Уникальное имя на диске')
size_field = models.IntegerField(verbose_name='Размер (байты)')
file_type_field = models.CharField(max_length=50, verbose_name='Тип файла')
comment_field = models.TextField(blank=True, verbose_name='Комментарий')
description_field = models.TextField(blank=True, verbose_name='Описание')
tags_field = models.ManyToManyField('Tag', blank=True, verbose_name='Теги')
upload_date_field = models.DateTimeField(
    auto_now_add=True, verbose_name='Дата загрузки')
last_modified_date_field = models.DateTimeField(
    auto_now=True, verbose_name='Дата последнего изменения')
last_download_date_field = models.DateTimeField(
    null=True, blank=True, verbose_name='Дата последнего скачивания')
views_count_field = models.IntegerField(
    default=0, verbose_name='Количество просмотров')
downloads_count_field = models.IntegerField(
    default=0, verbose_name='Количество скачиваний')
special_link_field = models.CharField(
    max_length=255, unique=True, verbose_name='Специальная ссылка')
is_public_field = models.BooleanField(
    default=False, verbose_name='Доступен по ссылке')
deleted_at_field = models.DateTimeField(
    null=True, blank=True, verbose_name='Дата удаления')
preview_field = models.ImageField(
    upload_to='previews/', null=True, blank=True, verbose_name='Превью')
