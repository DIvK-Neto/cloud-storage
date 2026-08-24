from django.db import models

file_field = models.ForeignKey(
    'File', on_delete=models.CASCADE, verbose_name='Файл', null=True, blank=True
)

folder_field = models.ForeignKey(
    'Folder', on_delete=models.CASCADE, verbose_name='Папка', null=True, blank=True
)

link_type_field = models.CharField(
    max_length=10,
    choices=[('view', 'Просмотр'), ('download', 'Скачивание')],
    verbose_name='Тип ссылки'
)

created_at_field = models.DateTimeField(
    auto_now_add=True, verbose_name='Дата создания'
)

expires_at_field = models.DateTimeField(
    null=True, blank=True, verbose_name='Дата истечения'
)

allowed_users_field = models.ManyToManyField(
    'accounts_app.CustomUser', blank=True, verbose_name='Разрешённые пользователи'
)

allow_comments_field = models.BooleanField(
    default=False, verbose_name='Разрешить комментарии'
)
