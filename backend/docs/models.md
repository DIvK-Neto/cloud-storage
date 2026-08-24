# Модели данных бэкенда «My Cloud»

В этом документе описаны все модели базы данных, их поля, связи и методы.

<details>
<summary>📚 Оглавление</summary>

1. [CustomUser](#customuser) — пользователь
2. [Folder](#folder) — папка
3. [File](#file) — файл
4. [ShareLink](#sharelink) — специальная ссылка
5. [GuestComment](#guestcomment) — комментарий гостя
6. [AppLogEntry](#applogentry) — запись лога

</details>

---

## CustomUser

Модель пользователя, расширяющая стандартного `AbstractUser` Django. Используется для аутентификации и хранения информации о пользователях.

**Поля:**
- `full_name` — полное имя (CharField, max_length=150).
- `login` — уникальный логин (CharField, max_length=20) — используется как `USERNAME_FIELD` (поле входа).
- `is_admin` — признак администратора (BooleanField, default=False).
- `storage_path` — путь к папке пользователя на диске (CharField, max_length=255, может быть пустым).

**Наследуемые поля от `AbstractUser`:**
- `username` (скрыто, но остаётся для совместимости, автоматически заполняется значением `login`).
- `email`, `first_name`, `last_name`, `is_active`, `is_staff`, `is_superuser`, `last_login`, `date_joined`, `groups`, `user_permissions`.

**Менеджер:** `CustomUserManager` (в `core/managers/accounts_specific/`), который переопределяет методы `create_user` и `create_superuser`, используя поле `login`.

**Методы:**
- `__str__()` — возвращает логин пользователя.
- (наследуются стандартные методы Django)

**Связи:**
- `File` (ForeignKey) — файлы пользователя.
- `Folder` (ForeignKey) — папки пользователя.
- `AppLogEntry` (ForeignKey) — записи логов, связанные с пользователем.

---

## Folder

Модель папки для организации файлов.

**Поля:**
- `user` — владелец папки (ForeignKey на `CustomUser`).
- `name` — название папки (CharField, max_length=100).
- `description` — описание папки (TextField, опционально).
- `parent` — родительская папка (ForeignKey на себя, null=True, blank=True) — для создания вложенности.
- `created_at` — дата создания (DateTimeField, auto_now_add=True).
- `updated_at` — дата последнего обновления (DateTimeField, auto_now=True).
- `deleted_at` — дата мягкого удаления (DateTimeField, null=True, blank=True) — используется для корзины.

**Методы:**
- `__str__()` — возвращает имя папки и логин владельца.
- `get_full_path()` — возвращает полный путь папки от корня пользователя (рекурсивно).
- `soft_delete()` — помечает папку как удалённую.
- `restore()` — восстанавливает папку из корзины.

**Связи:**
- `user` → `CustomUser`.
- `parent` → `Folder` (сам на себя).
- `Folder` имеет обратную связь с `File` (файлы в папке).

**Ограничения:** уникальность имени папки среди папок одного пользователя и одного родителя (`unique_together = ['user', 'name', 'parent']`).

---

## File

Модель файла, загруженного пользователем.

**Поля:**
- `user` — владелец файла (ForeignKey на `CustomUser`).
- `folder` — папка, в которой находится файл (ForeignKey на `Folder`, null=True, blank=True) — если не указана, файл лежит в корне.
- `original_name` — оригинальное имя файла (CharField, max_length=255).
- `unique_name` — уникальное имя на диске (CharField, max_length=255, генерируется автоматически при загрузке).
- `size` — размер файла в байтах (IntegerField).
- `file_type` — тип файла (CharField, max_length=50, определяется по расширению или MIME-типу).
- `comment` — комментарий пользователя к файлу (TextField, опционально).
- `description` — описание файла (TextField, опционально).
- `tags` — теги (ManyToManyField на модель `Tag`, опционально) — (пока не реализовано, но задел).
- `upload_date` — дата загрузки (DateTimeField, auto_now_add=True).
- `last_modified_date` — дата последнего изменения (DateTimeField, auto_now=True) — обновляется при изменении имени, комментария, описания, перемещении.
- `last_download_date` — дата последнего скачивания (DateTimeField, null=True, blank=True).
- `views_count` — количество просмотров (IntegerField, default=0).
- `downloads_count` — количество скачиваний (IntegerField, default=0).
- `special_link` — UUID для внешнего доступа (CharField, max_length=255, уникальный, генерируется при создании файла).
- `is_public` — доступен ли файл по специальной ссылке (BooleanField, default=False).
- `deleted_at` — дата мягкого удаления (DateTimeField, null=True, blank=True) — для корзины.
- `preview` — изображение-превью (ImageField, upload_to='previews/', null=True, blank=True) — для изображений.

**Методы:**
- `__str__()` — возвращает оригинальное имя файла.
- `increment_views()` — увеличивает счётчик просмотров.
- `increment_downloads()` — увеличивает счётчик скачиваний и обновляет `last_download_date`.
- `soft_delete()` — помечает файл как удалённый.
- `restore()` — восстанавливает файл из корзины.
- `generate_special_link()` — генерирует уникальный UUID для `special_link`.

**Связи:**
- `user` → `CustomUser`.
- `folder` → `Folder`.
- `tags` → `Tag` (пока не создана, но задел).

---

## ShareLink

Модель специальной ссылки для доступа к файлу без аутентификации.

**Поля:**
- `file` — файл, к которому даётся доступ (ForeignKey на `File`).
- `link_type` — тип ссылки: `view` (просмотр) или `download` (скачивание) (CharField, choices).
- `created_at` — дата создания (DateTimeField, auto_now_add=True).
- `expires_at` — дата истечения срока действия (DateTimeField, null=True, blank=True).
- `allowed_users` — пользователи, которым разрешён доступ (ManyToManyField на `CustomUser`, опционально) — если не указаны, доступ открыт всем.
- `allow_comments` — разрешены ли комментарии гостей по этой ссылке (BooleanField, default=False).
- `uuid` — уникальный идентификатор ссылки (UUIDField, default=uuid.uuid4, editable=False, unique=True) — используется в URL вместо числового ID.

**Методы:**
- `is_expired()` — проверяет, истёк ли срок действия ссылки.
- `__str__()` — возвращает информацию о ссылке (файл и тип).

**Связи:**
- `file` → `File`.
- `allowed_users` → `CustomUser`.

---

## GuestComment

Модель комментария, оставленного гостем (неавторизованным пользователем) к файлу.

**Поля:**
- `file` — файл, к которому оставлен комментарий (ForeignKey на `File`).
- `guest_name` — имя гостя (CharField, max_length=100).
- `guest_email` — email гостя (EmailField, опционально).
- `content` — текст комментария (TextField).
- `created_at` — дата создания (DateTimeField, auto_now_add=True).

**Методы:**
- `__str__()` — возвращает имя гостя и файл.

**Связи:**
- `file` → `File`.

---

## AppLogEntry

Модель для хранения логов (записей событий) в базе данных.

**Поля:**
- `timestamp` — дата и время события (DateTimeField, auto_now_add=True).
- `level` — уровень логирования (CharField, max_length=10) — например, INFO, ERROR.
- `module` — имя модуля, где произошло событие (CharField, max_length=100) — например, `api.views`, `apps.accounts_app`.
- `message` — текст сообщения (TextField).
- `user` — пользователь, связанный с событием (ForeignKey на `CustomUser`, null=True, blank=True) — если событие связано с действием пользователя.
- `ip` — IP-адрес, с которого был запрос (GenericIPAddressField, null=True, blank=True).
- `category` — категория события (CharField, max_length=50) — например, `auth`, `files`, `admin`, `system`.

**Методы:**
- `__str__()` — возвращает краткое представление (дата, уровень, модуль и начало сообщения).

**Связи:**
- `user` → `CustomUser` (опционально).

---