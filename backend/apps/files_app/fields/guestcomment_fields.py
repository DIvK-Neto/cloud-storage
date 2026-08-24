from django.db import models

file_field = models.ForeignKey(
    'File', on_delete=models.CASCADE, verbose_name='Файл')
guest_name_field = models.CharField(max_length=100, verbose_name='Имя гостя')
guest_email_field = models.EmailField(
    blank=True, null=True, verbose_name='Email гостя')
content_field = models.TextField(verbose_name='Текст комментария')
created_at_field = models.DateTimeField(
    auto_now_add=True, verbose_name='Дата создания')
