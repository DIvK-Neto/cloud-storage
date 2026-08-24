# Архитектура бэкенда «My Cloud»

В этом документе описана структура бэкенда, назначение модулей и принципы организации кода.

<details>
<summary>📚 Оглавление</summary>

- [Архитектура бэкенда «My Cloud»](#архитектура-бэкенда-my-cloud)
  - [Общая структура](#общая-структура)
  - [Папка `core/`](#папка-core)
  - [Папка `apps/`](#папка-apps)
    - [`accounts_app`](#accounts_app)
    - [`files_app`](#files_app)
    - [`logs_app`](#logs_app)
  - [Папка `api/`](#папка-api)
  - [Папка `cloud_storage/`](#папка-cloud_storage)
  - [Принципы и правила](#принципы-и-правила)
    - [2.1. Модульность](#21-модульность)
    - [2.2. Сборщики (`all_*.py`)](#22-сборщики-all_py)
    - [2.3. Импорты](#23-импорты)
    - [2.4. Имена](#24-имена)
    - [2.5. `__init__.py`](#25-__init__py)
    - [2.6. `settings.py`](#26-settingspy)

</details>

---

## Общая структура


```plaintext
backend/
├── core/                    # общие компоненты
│   ├── validators/          # валидаторы
│   │   ├── common/          # общие для всех приложений
│   │   │   ├── __init__.py
│   │   │   ├── all_validators.py
│   │   │   ├── name_validator.py
│   │   │   ├── login_validator.py
│   │   │   ├── password_validator.py
│   │   │   └── folder_name_validator.py
│   │   ├── accounts_specific/
│   │   └── files_specific/
│   ├── mixins/              # дополнительные методы для моделей
│   │   ├── common/
│   │   │   ├── __init__.py
│   │   │   ├── all_mixins.py
│   │   │   ├── soft_delete.py
│   │   │   ├── timestamp.py
│   │   │   └── tree.py
│   │   ├── accounts_specific/
│   │   └── files_specific/
│   ├── managers/            # кастомные менеджеры (запросы к БД)
│   │   ├── common/
│   │   │   ├── __init__.py
│   │   │   └── active_manager.py
│   │   ├── accounts_specific/
│   │   │   ├── __init__.py
│   │   │   ├── all_managers.py
│   │   │   └── custom_user_manager.py
│   │   └── files_specific/
│   └── utils/               # вспомогательные функции
│       ├── common/
│       │   ├── __init__.py
│       │   ├── file_helpers.py
│       │   └── general.py
│       ├── accounts_specific/
│       └── files_specific/
├── apps/                    # бизнес-приложения
│   ├── accounts_app/        # управление пользователями
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py        # сборщик моделей
│   │   ├── fields/          # описания полей модели
│   │   │   ├── __init__.py
│   │   │   ├── all_fields.py
│   │   │   ├── name_fields.py
│   │   │   ├── auth_fields.py
│   │   │   ├── is_admin_field.py
│   │   │   └── storage_path_field.py
│   │   └── model_definitions/  # модели (каждая в отдельном файле)
│   │       ├── __init__.py
│   │       ├── all_models.py
│   │       └── custom_user.py
│   ├── files_app/           # управление файлами и папками
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py        # сборщик моделей
│   │   ├── fields/          # описания полей для всех моделей
│   │   │   ├── __init__.py
│   │   │   ├── all_fields.py
│   │   │   ├── tag_fields.py
│   │   │   ├── folder_fields.py
│   │   │   ├── file_fields.py
│   │   │   ├── filehistory_fields.py
│   │   │   ├── sharelink_fields.py
│   │   │   ├── guestcomment_fields.py
│   │   │   └── accesslog_fields.py
│   │   └── model_definitions/  # модели
│   │       ├── __init__.py
│   │       ├── all_models.py
│   │       ├── tag.py
│   │       ├── folder.py
│   │       ├── file.py
│   │       ├── file_history.py
│   │       ├── share_link.py
│   │       ├── guest_comment.py
│   │       └── access_log.py
│   └── logs_app/            # логирование в БД
│       ├── __init__.py
│       ├── admin.py
│       ├── apps.py
│       ├── models.py        # сборщик моделей
│       ├── fields/          # описания полей для AppLogEntry
│       │   ├── __init__.py
│       │   ├── all_fields.py
│       │   └── log_entry_fields.py
│       ├── model_definitions/
│       │   ├── __init__.py
│       │   ├── all_models.py
│       │   └── app_log_entry.py
│       └── handlers/        # кастомный обработчик логов
│           ├── __init__.py
│           └── database_handler.py
├── api/                     # внешний слой (REST API)
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   ├── urls.py              # корневой сборщик маршрутов
│   ├── handlers/            # представления (эндпоинты)
│   │   ├── __init__.py
│   │   ├── all_handlers.py  # сборщик всех представлений
│   │   ├── auth/            # регистрация, вход, выход
│   │   │   ├── __init__.py
│   │   │   ├── register.py
│   │   │   ├── login.py
│   │   │   └── logout.py
│   │   ├── folders/         # папки
│   │   │   ├── __init__.py
│   │   │   ├── list.py
│   │   │   ├── create.py
│   │   │   ├── delete.py
│   │   │   ├── rename.py
│   │   │   └── move.py
│   │   ├── files/           # файлы
│   │   │   ├── __init__.py
│   │   │   ├── list.py
│   │   │   ├── upload.py
│   │   │   ├── delete.py
│   │   │   ├── rename.py
│   │   │   ├── download.py
│   │   │   ├── move.py
│   │   │   └── comment.py
│   │   ├── share/           # специальные ссылки
│   │   │   ├── __init__.py
│   │   │   ├── create_link.py
│   │   │   └── access_link.py
│   │   ├── comments/        # комментарии
│   │   │   ├── __init__.py
│   │   │   ├── create.py
│   │   │   └── list.py
│   │   ├── admin/           # административные эндпоинты
│   │   │   ├── __init__.py
│   │   │   ├── user_list.py
│   │   │   ├── user_delete.py
│   │   │   └── user_toggle_admin.py
│   │   └── system/          # системные эндпоинты
│   │       ├── __init__.py
│   │       └── health_check.py
│   ├── serializers/         # сериализаторы
│   │   ├── __init__.py
│   │   ├── all_serializers.py  # сборщик всех сериализаторов
│   │   ├── auth/
│   │   │   ├── __init__.py
│   │   │   ├── register.py
│   │   │   └── login.py
│   │   ├── files/
│   │   │   ├── __init__.py
│   │   │   ├── folder.py
│   │   │   ├── file.py
│   │   │   └── upload.py
│   │   ├── share/
│   │   │   ├── __init__.py
│   │   │   └── share_serializers.py
│   │   ├── comments/
│   │   │   ├── __init__.py
│   │   │   └── guest_comment_serializers.py
│   │   └── admin/
│   │       ├── __init__.py
│   │       └── user_serializers.py
│   ├── middleware/          # middleware
│   │   ├── __init__.py
│   │   └── csrf.py          # отключение CSRF для API
│   ├── exceptions/          # обработчики ошибок
│   │   ├── __init__.py
│   │   └── exception_handler.py  # кастомные сообщения об ошибках
│   └── routes/              # подфайлы маршрутов
│       ├── __init__.py      # сборщик всех маршрутов
│       ├── auth.py
│       ├── folders.py
│       ├── files.py
│       ├── share.py
│       ├── comments.py
│       └── admin.py
└── cloud_storage/           # настройки проекта Django
    ├── __init__.py
    ├── settings.py
    ├── urls.py
    ├── wsgi.py
    └── asgi.py
```

---

## Папка `core/`

Содержит общие компоненты, которые могут использоваться в любом приложении.

- **`validators/`** — валидаторы для проверки данных (имя, логин, пароль, имя папки, размер файла и т.д.).
- **`mixins/`** — миксины для моделей: мягкое удаление, временные метки, работа с деревом папок.
- **`managers/`** — кастомные менеджеры для моделей (например, `CustomUserManager` для пользователя).
- **`utils/`** — вспомогательные функции (форматирование размера, генерация UUID, определение типа файла).

---

## Папка `apps/`

Содержит все бизнес-приложения. Каждое приложение имеет единую структуру:

- **`fields/`** — описания полей моделей (каждое поле в отдельном файле, сборщик `all_fields.py`).
- **`model_definitions/`** — модели (каждая модель в отдельном файле, сборщик `all_models.py`).
- **`admin.py`** — регистрация моделей в админке.
- **`models.py`** — корневой сборщик моделей (импортирует из `model_definitions.all_models`).
- **`apps.py`** — конфигурация приложения (`name = 'apps.<app_name>'`).
- **`__init__.py`** — пустой.

### `accounts_app`
Модель `CustomUser` с кастомным менеджером, валидаторами и полями (логин, полное имя, is_admin, storage_path).

### `files_app`
Модели `Folder`, `File`, `ShareLink`, `GuestComment`. Реализует всю логику файлового хранилища.

### `logs_app`
Модель `AppLogEntry` для хранения логов в БД. Содержит кастомный обработчик `DatabaseLogHandler`, который записывает логи в базу.

---

## Папка `api/`

Внешний слой, предоставляющий REST API.

- **`handlers/`** — представления (эндпоинты), разбитые по функциональности. Каждая операция в отдельном файле.
- **`serializers/`** — сериализаторы для моделей, разбитые по функциональности.
- **`middleware/`** — middleware для отключения CSRF на API.
- **`exceptions/`** — кастомный обработчик ошибок DRF.
- **`routes/`** — подфайлы маршрутов, каждый отвечает за свою группу эндпоинтов.
- **`urls.py`** (корневой) — сборщик всех маршрутов из папки `routes/`.

---

## Папка `cloud_storage/`

Стандартная папка Django с настройками проекта:
- `settings.py` — основные настройки, включая `INSTALLED_APPS`, `MIDDLEWARE`, `DATABASES`, `LOGGING`.
- `urls.py` — корневые маршруты (подключает `api.urls` и `admin`).
- `wsgi.py` и `asgi.py` — для запуска сервера.

---

## Принципы и правила

### 2.1. Модульность
- Каждое приложение отвечает за свою область (пользователи, файлы, логи).
- Общие компоненты вынесены в `core/`.
- Внутри приложений код разделён по слоям (поля, модели, представления, сериализаторы).

### 2.2. Сборщики (`all_*.py`)
- В каждой папке с однотипными файлами (`fields/`, `model_definitions/`, `handlers/`, `serializers/`, `routes/`) есть сборщик `all_*.py`, который импортирует все файлы и делает их доступными через один импорт.
- Это делает импорты явными и прозрачными: всегда видно, откуда берётся код.

### 2.3. Импорты
- Модели импортируют поля из `fields/all_fields.py`.
- Миксины, менеджеры, валидаторы — из `core/.../all_*.py`.
- Корневой `models.py` импортирует из `model_definitions.all_models`.
- `admin.py` импортирует из `model_definitions.all_models`.

### 2.4. Имена
- Приложения: `*_app` (например, `accounts_app`, `files_app`).
- Специфичные компоненты в `core`: `*_specific` (например, `accounts_specific`, `files_specific`).
- Файлы — `snake_case` (строчные буквы с подчёркиваниями).

### 2.5. `__init__.py`
- Всегда присутствует, в папках `fields/` и `model_definitions/` — пустой.
- **Почему:** `__init__.py` нужен только для того, чтобы Python воспринимал папку как пакет. Вся логика сборки вынесена в `all_*.py`, чтобы импорты были явными, а код оставался модульным и легко расширяемым.

### 2.6. `settings.py`
- `INSTALLED_APPS` содержит `apps.accounts_app`, `apps.files_app`, `api`, `apps.logs_app`.
- `AUTH_USER_MODEL = 'accounts_app.CustomUser'`.
