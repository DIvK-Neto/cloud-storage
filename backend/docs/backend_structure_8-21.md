# Структура бэкенда (backend/) – актуальная на 21.08.2026

## Полное дерево папок и файлов (с пояснениями для каждой строки)


```plaintext
backend/
├── db.sqlite3                                        # Локальная SQLite-база (не используется в продакшене)
├── manage.py                                         # Управляющий скрипт Django (миграции, runserver, shell и т.д.)
├── README.md                                         # Документация по бэкенду (установка, запуск, API)
├── requirements.txt                                  # Зависимости Python (Django, DRF, psycopg2, python-dotenv и др.)
├── api/                                              # Внешний слой REST API (все эндпоинты)
│   ├── __init__.py                                   # Маркер пакета (пустой)
│   ├── admin.py                                      # Регистрация моделей в админке Django (пусто, т.к. админка не используется)
│   ├── apps.py                                       # Конфигурация приложения API (имя, метка)
│   ├── models.py                                     # Импорт моделей (пусто, модели в apps/)
│   ├── tests.py                                      # Тесты для API (заглушка)
│   ├── urls.py                                       # Корневые маршруты API (подключает все routes/)
│   ├── views.py                                      # Устаревшие вьюхи (перенесены в handlers/)
│   ├── exceptions/                                   # Кастомные обработчики ошибок DRF
│   │   ├── __init__.py                               # Маркер пакета
│   │   └── exception_handler.py                      # Переопределение обработчика ошибок (возвращает понятные сообщения для 403 и др.)
│   ├── handlers/                                     # Представления (контроллеры) – каждый эндпоинт в отдельном файле
│   │   ├── __init__.py                               # Маркер пакета
│   │   ├── all_handlers.py                           # Сборщик всех хендлеров для удобного импорта
│   │   ├── admin/                                    # Административные эндпоинты (только для пользователей с is_admin=True)
│   │   │   ├── __init__.py
│   │   │   ├── user_delete.py                        # DELETE /admin/users/<id>/delete/ – удаление пользователя (только админ)
│   │   │   ├── user_list.py                          # GET /admin/users/ – список всех пользователей (только админ)
│   │   │   └── user_toggle_admin.py                  # PATCH /admin/users/<id>/toggle-admin/ – изменение флага is_admin (только админ)
│   │   ├── auth/                                     # Эндпоинты аутентификации и регистрации
│   │   │   ├── __init__.py
│   │   │   ├── check_email.py                        # GET /check-email/ – проверка занятости email (для валидации на фронтенде)
│   │   │   ├── check_login.py                        # GET /check-login/ – проверка занятости логина
│   │   │   ├── current_user.py                       # GET /user/ – получение данных текущего пользователя по сессии
│   │   │   ├── login.py                              # POST /login/ – вход (сессионная аутентификация)
│   │   │   ├── logout.py                             # POST /logout/ – выход (удаление сессии)
│   │   │   └── register.py                           # POST /register/ – регистрация нового пользователя с валидацией
│   │   ├── comments/                                 # Комментарии гостей (без авторизации)
│   │   │   ├── __init__.py
│   │   │   ├── create.py                             # POST /comments/create/ – создание комментария к файлу (имя, email, текст)
│   │   │   └── list.py                               # GET /comments/?file_id= – список комментариев для файла
│   │   ├── dashboard/                                # ★ НОВОЕ – эндпоинты для Dashboard
│   │   │   ├── __init__.py
│   │   │   └── search.py                             # GET /dashboard/search/ – поиск по файлам и папкам с фильтрацией и статистикой
│   │   ├── download/                                 # Скачивание (массовое и отдельных элементов)
│   │   │   ├── __init__.py
│   │   │   └── download_bulk.py                      # GET /download/bulk/ – массовое скачивание нескольких элементов одним ZIP-архивом
│   │   ├── files/                                    # Операции с файлами (только для авторизованных)
│   │   │   ├── __init__.py
│   │   │   ├── comment.py                            # PATCH /files/<id>/comment/ – обновление комментария файла
│   │   │   ├── delete.py                             # DELETE /files/<id>/delete/ – мягкое удаление (перемещение в корзину)
│   │   │   ├── download.py                           # GET /files/<id>/download/ – скачивание файла (с обновлением счётчика)
│   │   │   ├── list.py                               # GET /files/ – список файлов (с фильтром по папке, исключая удалённые)
│   │   │   ├── move.py                               # PATCH /files/<id>/move/ – перемещение файла в другую папку
│   │   │   ├── rename.py                             # PATCH /files/<id>/rename/ – переименование файла
│   │   │   └── upload.py                             # POST /files/upload/ – загрузка нового файла (с уникальным именем)
│   │   ├── folders/                                  # Операции с папками (только для авторизованных)
│   │   │   ├── __init__.py
│   │   │   ├── comment.py                            # PATCH /folders/<id>/comment/ – обновление описания папки
│   │   │   ├── create.py                             # POST /folders/create/ – создание новой папки
│   │   │   ├── delete.py                             # DELETE /folders/<id>/delete/ – мягкое удаление папки (рекурсивно)
│   │   │   ├── download_folder.py                    # GET /folders/<id>/download-folder/ – скачивание папки как ZIP-архива
│   │   │   ├── list.py                               # GET /folders/ – список папок (с параметрами parent, all, исключая удалённые)
│   │   │   ├── move.py                               # PATCH /folders/<id>/move/ – перемещение папки (с проверкой циклов)
│   │   │   ├── path.py                               # GET /folders/<id>/path/ – получение пути к папке (для хлебных крошек)
│   │   │   ├── rename.py                             # PATCH /folders/<id>/rename/ – переименование папки
│   │   │   └── stats.py                              # GET /folders/<id>/stats/ – статистика папки (текущая и рекурсивная, типы файлов)
│   │   ├── health/                                   # Проверка работоспособности
│   │   │   ├── __init__.py
│   │   │   └── health_check.py                       # GET /health/ – возвращает статус OK (для мониторинга)
│   │   ├── share/                                    # Специальные ссылки (отдельные и коллекции)
│   │   │   ├── __init__.py
│   │   │   ├── access_collection_link.py             # GET /share/collection/<uuid>/ – доступ к коллекции (просмотр, скачивание ZIP)
│   │   │   ├── access_link.py                        # GET /share/<uuid>/ – доступ к отдельному файлу/папке по ссылке
│   │   │   ├── create_collection_link.py             # POST /share/create-collection/ – создание общей ссылки на коллекцию
│   │   │   ├── create_link.py                        # POST /share/create/ – создание отдельной ссылки на файл/папку
│   │   │   ├── list_links.py                         # GET /share/links/ – список ссылок для элемента (включая коллекции)
│   │   │   ├── update_collection.py                  # PATCH/DELETE /share/collection/<uuid>/ – обновление/удаление коллекции
│   │   │   └── update_link.py                        # PATCH/DELETE /share/update/<id>/ – обновление/удаление отдельной ссылки
│   │   ├── storage/                                  # Статистика хранилища пользователя
│   │   │   ├── __init__.py
│   │   │   └── stats.py                              # GET /storage/stats/ – общая статистика пользователя (current_* и total_*)
│   │   └── trash/                                    # Операции с корзиной (восстановление, окончательное удаление)
│   │       ├── __init__.py                           # Маркер пакета
│   │       ├── clear.py                              # DELETE /trash/clear/ – очистка всей корзины (окончательное удаление всех элементов)
│   │       ├── count.py                              # GET /trash/count/ – количество элементов в корзине (для бейджа)
│   │       ├── list.py                               # ★ ИСПРАВЛЕН – использует search_utils для поиска и статистики
│   │       ├── permanent_delete.py                   # DELETE /trash/<id>/permanent/ – окончательное удаление элемента (с диска)
│   │       └── restore.py                            # POST /trash/<id>/restore/ – восстановление элемента (рекурсивно для папок)
│   ├── middleware/                                   # Промежуточные слои (middleware)
│   │   ├── __init__.py
│   │   └── csrf.py                                   # Отключает проверку CSRF для API (т.к. используется сессионная аутентификация)
│   ├── routes/                                       # Подфайлы маршрутов (urlpatterns) для каждого модуля
│   │   ├── __init__.py                               # Пустой, маршруты подключаются через include в urls.py
│   │   ├── admin.py                                  # Маршруты /admin/ (user_list, user_delete, user_toggle_admin)
│   │   ├── auth.py                                   # Маршруты /login/, /logout/, /register/, /user/, /check-login/, /check-email/
│   │   ├── comments.py                               # Маршруты /comments/create/, /comments/
│   │   ├── dashboard.py                              # ★ НОВОЕ – маршрут /dashboard/search/
│   │   ├── download.py                               # Маршрут /download/bulk/
│   │   ├── files.py                                  # Маршруты /files/ (список, загрузка, удаление, переименование, перемещение, скачивание, комментарий)
│   │   ├── folders.py                                # Маршруты /folders/ (список, создание, удаление, переименование, перемещение, путь, статистика, скачивание)
│   │   ├── health.py                                 # Маршрут /health/
│   │   ├── share.py                                  # Маршруты /share/ (создание, доступ, обновление, удаление, список)
│   │   ├── storage.py                                # Маршрут /storage/stats/
│   │   └── trash.py                                  # Маршруты /trash/ (список, восстановление, окончательное удаление, очистка, счётчик)
│   └── serializers/                                  # Сериализаторы DRF (преобразование данных)
│       ├── __init__.py
│       ├── all_serializers.py                        # Сборщик всех сериализаторов для удобного импорта
│       ├── admin/                                    # Сериализаторы для админки
│       │   ├── __init__.py
│       │   └── user_serializers.py                   # Сериализатор пользователя (для админа, с количеством файлов)
│       ├── auth/                                     # Сериализаторы для аутентификации
│       │   ├── __init__.py
│       │   ├── login.py                              # Сериализатор для входа (логин, пароль)
│       │   ├── register.py                           # Сериализатор регистрации (с валидацией логина, email, пароля)
│       │   └── user_serializers.py                   # Сериализатор текущего пользователя (без пароля)
│       ├── comments/                                 # Сериализаторы для комментариев гостей
│       │   ├── __init__.py
│       │   └── guest_comment_serializers.py          # Сериализатор комментария (имя, email, текст, дата)
│       ├── files/                                    # Сериализаторы для файлов и папок
│       │   ├── __init__.py
│       │   ├── file.py                               # Сериализатор File (с полем has_share_link, добавлено поле name)
│       │   ├── folder.py                             # Сериализатор Folder (с рекурсивными подсчётами папок/файлов/размера, has_share_link)
│       │   └── upload.py                             # Сериализатор для загрузки файла (валидация)
│       └── share/                                    # Сериализаторы для ссылок
│           ├── __init__.py
│           ├── share_serializers.py                  # Сериализатор ShareLink (с password_view, password_download, исправлен для PATCH)
│           └── shared_collection_serializers.py      # Сериализатор SharedCollection (с password_view, password_download, user read_only)
├── apps/                                              # Бизнес-приложения Django
│   ├── __init__.py
│   ├── accounts_app/                                  # Приложение для управления пользователями
│   │   ├── __init__.py
│   │   ├── admin.py                                   # Регистрация CustomUser в админке Django
│   │   ├── apps.py                                    # Конфигурация приложения
│   │   ├── models.py                                  # Сборщик моделей (импорт из model_definitions)
│   │   ├── tests.py                                   # Тесты (заглушка)
│   │   ├── views.py                                   # (пусто)
│   │   ├── fields/                                    # Описания полей модели CustomUser
│   │   │   ├── __init__.py
│   │   │   ├── all_fields.py                          # Сборщик всех полей
│   │   │   ├── auth_fields.py                         # Поле login (уникальное)
│   │   │   ├── is_admin_field.py                      # Поле is_admin (булево)
│   │   │   ├── name_fields.py                         # Поле full_name (строка)
│   │   │   └── storage_path_field.py                  # Поле storage_path (путь к хранилищу пользователя)
│   │   └── model_definitions/                         # Определения моделей
│   │       ├── __init__.py
│   │       ├── all_models.py                          # Сборщик моделей
│   │       └── custom_user.py                         # Модель CustomUser (наследует AbstractUser, добавляет login, is_admin, storage_path)
│   ├── files_app/                                     # Приложение для управления файлами и папками
│   │   ├── __init__.py
│   │   ├── admin.py                                   # Регистрация всех моделей (Folder, File, ShareLink, GuestComment, AccessLog, SharedCollection)
│   │   ├── apps.py                                    # Конфигурация
│   │   ├── models.py                                  # Сборщик моделей
│   │   ├── tests.py                                   # Тесты (заглушка)
│   │   ├── views.py                                   # (пусто)
│   │   ├── fields/                                    # Описания полей для всех моделей
│   │   │   ├── __init__.py
│   │   │   ├── accesslog_fields.py                    # Поля для AccessLog (file, user, ip, action, created_at)
│   │   │   ├── all_fields.py                          # Сборщик всех полей
│   │   │   ├── file_fields.py                         # Поля для File (user, folder, original_name, unique_name, size, file_type, comment, description, tags, upload_date, last_modified_date, last_download_date, views_count, downloads_count, special_link, is_public, deleted_at, preview)
│   │   │   ├── filehistory_fields.py                  # Поля для FileHistory (file, folder, changed_by, field_name, old_value, new_value, changed_at)
│   │   │   ├── folder_fields.py                       # Поля для Folder (user, name, description, parent, created_at, updated_at, deleted_at)
│   │   │   ├── guestcomment_fields.py                 # Поля для GuestComment (file, guest_name, guest_email, content, created_at)
│   │   │   ├── shared_collection_fields.py            # Поля для SharedCollection (user, name, uuid, created_at, expires_at, allow_comments, allow_download, password, password_view, password_download, files (ManyToMany), folders (ManyToMany))
│   │   │   ├── sharelink_fields.py                    # Поля для ShareLink (file, folder, link_type, created_at, expires_at, allowed_users (ManyToMany), allow_comments, password, password_view, password_download, uuid)
│   │   │   └── tag_fields.py                          # Поля для Tag (name)
│   │   └── model_definitions/                         # Модели
│   │       ├── __init__.py
│   │       ├── access_log.py                          # Логи доступа к файлам (кто, когда, действие)
│   │       ├── all_models.py                          # Сборщик всех моделей
│   │       ├── file_history.py                        # История изменений файлов/папок (старое/новое значение)
│   │       ├── file.py                                # Модель файла (связи с пользователем, папкой, тегами)
│   │       ├── folder.py                              # Модель папки (иерархия, мягкое удаление)
│   │       ├── guest_comment.py                       # Комментарии гостей (без авторизации)
│   │       ├── share_link.py                          # Специальные ссылки (с поддержкой файлов и папок, двух паролей)
│   │       ├── shared_collection.py                   # Коллекции для общих ссылок (ManyToMany файлы/папки, два пароля)
│   │       └── tag.py                                 # Теги (задел для будущего)
│   └── logs_app/                                      # Приложение для логирования в БД
│       ├── __init__.py
│       ├── admin.py                                   # Регистрация AppLogEntry в админке
│       ├── apps.py                                    # Конфигурация
│       ├── models.py                                  # Сборщик моделей
│       ├── tests.py                                   # Тесты (заглушка)
│       ├── views.py                                   # (пусто)
│       ├── fields/                                    # Описания полей для AppLogEntry
│       │   ├── __init__.py
│       │   ├── all_fields.py                          # Сборщик полей
│       │   └── log_entry_fields.py                    # Поля AppLogEntry (уровень, модуль, сообщение, время)
│       ├── handlers/                                  # Обработчики логов
│       │   ├── __init__.py
│       │   └── database_handler.py                    # Кастомный обработчик для записи логов в БД (используется в settings.py)
│       └── model_definitions/                         # Модели
│           ├── __init__.py
│           ├── all_models.py                          # Сборщик моделей
│           └── app_log_entry.py                       # Модель записи лога (уровень, модуль, сообщение, created_at)
├── cloud_storage/                                     # Настройки проекта Django
│   ├── __init__.py
│   ├── asgi.py                                        # ASGI-приложение (для асинхронных запросов)
│   ├── settings.py                                    # Основные настройки (БД, приложения, CORS, логирование, медиа, статика)
│   ├── urls.py                                        # ★ ИСПРАВЛЕН – добавлен маршрут api.routes.dashboard
│   └── wsgi.py                                        # WSGI-приложение (для запуска на сервере)
├── core/                                              # Общие компоненты (переиспользуемые)
│   ├── managers/accounts_specific/                    # Кастомные менеджеры моделей (для User)
│   │   ├── __init__.py
│   │   ├── all_managers.py                            # Сборщик менеджеров
│   │   └── custom_user_manager.py                     # Менеджер для CustomUser (create_user, create_superuser)
│   ├── mixins/common/                                 # Миксины для моделей (поведение)
│   │   ├── all_mixins.py                              # Сборщик миксинов
│   │   ├── soft_delete.py                             # Миксин для мягкого удаления (поле deleted_at, методы soft_delete, restore)
│   │   ├── timestamp.py                               # Миксин для автоматического created_at/updated_at
│   │   └── tree.py                                    # Миксин для иерархических моделей (parent, children, get_full_path)
│   ├── utils/common/                                  # Общие утилиты
│   │   ├── __init__.py
│   │   ├── all_utils.py                               # Сборщик утилит
│   │   ├── search_utils.py                            # ★ НОВОЕ – универсальная утилита для поиска файлов и папок (активных и удалённых) с фильтрацией и статистикой
│   │   └── zip_utils.py                               # Утилита для создания ZIP-архивов (используется для скачивания папок/коллекций)
│   └── validators/common/                             # Валидаторы для полей моделей
│       ├── __init__.py
│       ├── all_validators.py                          # Сборщик валидаторов
│       ├── folder_name_validator.py                   # Проверка имени папки (запрет спецсимволов)
│       ├── login_validator.py                         # Проверка логина (латиница, цифры, длина)
│       ├── name_validator.py                          # Проверка полного имени (допустимые символы)
│       └── password_validator.py                      # Проверка пароля (длина, заглавная, цифра, спецсимвол)
└── docs/                                              # Документация бэкенда
    ├── api-endpoints.md                               # Описание всех эндпоинтов с примерами запросов/ответов
    ├── architecture.md                                # Архитектура бэкенда (слои, принципы)
    ├── authentication.md                              # Документация по аутентификации (сессии, CORS, CSRF)
    ├── backend_structure_8-21.md                      # ★ Актуальная структура ( 21.08.2026)
    ├── installation.md                                # Инструкция по установке и запуску бэкенда
    ├── logging.md                                     # Настройка логирования (консоль, файл, БД)
    └── models.md                                      # Описание моделей данных (схема БД)
```

## Пояснения к обновлённой структуре

### Ключевые изменения (21.08.2026)

1. **Новая утилита `core/utils/common/search_utils.py`**:
   - Универсальная функция `search_items` для поиска файлов и папок (активных и удалённых).
   - Поддерживает: режим поиска (текущая/все папки), учёт регистра, тип совпадения (общее/точное), тип элементов (все/папки/файлы).
   - При поиске «По всем папкам» возвращает поле `path` (полный путь к элементу).
   - Возвращает статистику с полями `current_*` и `total_*` (для Dashboard и Корзины).

2. **Новый хендлер `api/handlers/dashboard/search.py`**:
   - Эндпоинт `GET /dashboard/search/` для поиска на Dashboard.
   - Принимает параметры: `folder_id`, `search`, `ordering`, `page_size`, `search_mode`, `case_sensitive`, `match_mode`, `item_type`.
   - Использует `search_utils.search_items` для получения данных.
   - Возвращает пагинированный список с полем `stats` (статистика).

3. **Новый файл маршрутов `api/routes/dashboard.py`**:
   - Маршрут `dashboard/search/` подключён в `api/urls.py`.

4. **Обновлён `api/handlers/trash/list.py`**:
   - Переработан для использования `search_utils.search_items` вместо собственной логики.
   - Убрано дублирование кода (поиск, статистика, группировка по типам).
   - Фильтрация по типу (`item_type`) оставлена на уровне хендлера.

5. **Обновлён `api/handlers/folders/stats.py` и `api/handlers/storage/stats.py`**:
   - Добавлен фильтр `deleted_at__isnull=True` во все запросы (учёт только активных элементов).
   - Исправлены рекурсивные функции подсчёта статистики.

6. **Обновлён `api/urls.py`**:
   - Добавлено подключение `api.routes.dashboard`.

---
