from django.db import models

file_field = models.ForeignKey(
    'File', on_delete=models.CASCADE, verbose_name='Файл', null=True, blank=True)
folder_field = models.ForeignKey(
    'Folder', on_delete=models.CASCADE, verbose_name='Папка', null=True, blank=True)
changed_by_field = models.ForeignKey(
    'accounts_app.CustomUser', on_delete=models.SET_NULL, null=True, verbose_name='Кто изменил')
field_name_field = models.CharField(max_length=100, verbose_name='Имя поля')
old_value_field = models.TextField(
    blank=True, null=True, verbose_name='Старое значение')
new_value_field = models.TextField(
    blank=True, null=True, verbose_name='Новое значение')
changed_at_field = models.DateTimeField(
    auto_now_add=True, verbose_name='Дата и время изменения')
