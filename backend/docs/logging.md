# Логирование в бэкенде «My Cloud»

В этом документе описаны настройки логирования, уровни, форматы, категории и механизмы записи логов.

<details>
<summary>📚 Оглавление</summary>

- [Логирование в бэкенде «My Cloud»](#логирование-в-бэкенде-my-cloud)
  - [Общие принципы](#общие-принципы)
  - [Настройка `LOGGING` в `settings.py`](#настройка-logging-в-settingspy)
  - [Категории событий](#категории-событий)
  - [Уровни логирования](#уровни-логирования)
  - [Форматы логов](#форматы-логов)
    - [Простой формат (консоль):](#простой-формат-консоль)
    - [Подробный формат (файл):](#подробный-формат-файл)
  - [Запись в базу данных (кастомный обработчик)](#запись-в-базу-данных-кастомный-обработчик)
  - [Примеры логов](#примеры-логов)
    - [Успешная регистрация](#успешная-регистрация)
    - [Загрузка файла](#загрузка-файла)
    - [Ошибка доступа](#ошибка-доступа)
    - [Административное действие](#административное-действие)
    - [Ошибка сервера](#ошибка-сервера)

</details>

---

## Общие принципы

- Логирование настроено для всех слоёв приложения: Django, API, приложения (`apps`).
- Логи пишутся **в консоль** (для разработки), **в файлы** (с ротацией) и **в базу данных** (модель `AppLogEntry`).
- Каждая запись содержит: дату, уровень, модуль, сообщение, а также (если доступно) пользователя и IP-адрес.
- В продакшене уровень логирования устанавливается на `INFO`, в разработке — `DEBUG`.

---

## Настройка `LOGGING` в `settings.py`

Блок `LOGGING` определяет обработчики, форматеры и логгеры.


```python
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
        'file': {
            'class': 'logging.handlers.RotatingFileHandler',
            'filename': os.path.join(BASE_DIR, 'logs', 'django.log'),
            'maxBytes': 5 * 1024 * 1024,  # 5 MB
            'backupCount': 5,
            'formatter': 'verbose',
        },
        'db': {
            'class': 'apps.logs_app.handlers.database_handler.DatabaseLogHandler',
        },
    },
    'root': {
        'handlers': ['console', 'file', 'db'],
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['console', 'file', 'db'],
            'level': 'INFO',
            'propagate': True,
        },
        'api': {
            'handlers': ['console', 'file', 'db'],
            'level': 'DEBUG',
            'propagate': True,
        },
        'apps': {
            'handlers': ['console', 'file', 'db'],
            'level': 'DEBUG',
            'propagate': True,
        },
    },
}
```

**Что делают обработчики:**
- `console` — вывод в терминал (полезно при разработке).
- `file` — запись в файл с ротацией (при достижении 5 МБ создаётся новый файл, старые архивируются, хранится 5 файлов).
- `db` — запись в базу данных через кастомный обработчик `DatabaseLogHandler`.

---

## Категории событий

Логи разделены по категориям, которые записываются в поле `category` модели `AppLogEntry`:

- **`auth`** — регистрация, вход, выход.
- **`files`** — загрузка, скачивание, удаление, переименование, перемещение файлов и папок.
- **`admin`** — административные действия (удаление пользователей, изменение прав).
- **`system`** — запуск/остановка сервера, ошибки инфраструктуры.
- **`general`** — все остальные события (по умолчанию).

Категория определяется в коде при вызове логгера. Например, в представлении регистрации:


```python
import logging
logger = logging.getLogger(__name__)

def post(self, request):
    ...
    logger.info(f"User {login} registered", extra={'category': 'auth'})
```

---

## Уровни логирования

- **`DEBUG`** — детальная информация для разработки (SQL-запросы, отладочные данные). Используется в `api` и `apps` при `DEBUG = True`.
- **`INFO`** — общие события (запуск сервера, успешный вход, загрузка файла).
- **`WARNING`** — некритичные проблемы (попытка доступа к несуществующему файлу, ошибки валидации).
- **`ERROR`** — критические ошибки, требующие вмешательства (ошибка записи в БД, недоступность хранилища).

**В продакшене** уровень логирования устанавливается на `INFO`, чтобы избежать захламления логов отладочной информацией.

---

## Форматы логов

### Простой формат (консоль):


```plaintext
INFO 2026-07-07 10:15:00 files.upload Пользователь admin загрузил файл report.pdf
```

### Подробный формат (файл):


```plaintext
INFO 2026-07-07 10:15:00 files.upload 1234 5678 Пользователь admin загрузил файл report.pdf
```

**Поля:**
- `levelname` — уровень (INFO, ERROR и т.д.).
- `asctime` — дата и время.
- `module` — имя модуля (например, `files.upload`).
- `process` — ID процесса.
- `thread` — ID потока.
- `message` — текст сообщения.

---

## Запись в базу данных (кастомный обработчик)

Для записи логов в базу данных используется обработчик `DatabaseLogHandler` из приложения `logs_app`.

**Файл `apps/logs_app/handlers/database_handler.py`:**


```python
import logging
from apps.logs_app.model_definitions.all_models import AppLogEntry

class DatabaseLogHandler(logging.Handler):
    def emit(self, record):
        try:
            AppLogEntry.objects.create(
                level=record.levelname,
                module=record.name,
                message=record.getMessage(),
                user=None,  # будет заполняться через middleware
                ip=None,    # будет заполняться через middleware
                category='general'
            )
        except Exception:
            pass  # не ломаем приложение, если логирование не сработало
```

**Заполнение `user` и `ip`:**  
В будущем можно добавить middleware, которое будет извлекать пользователя и IP из запроса и передавать их в логгер через `extra` или `threading.local`.

---

## Примеры логов

### Успешная регистрация


```plaintext
INFO 2026-07-07 10:00:00 auth.register Пользователь newuser зарегистрирован
```

### Загрузка файла


```plaintext
INFO 2026-07-07 10:15:00 files.upload Пользователь admin загрузил файл report.pdf (размер: 1024 КБ)
```

### Ошибка доступа


```plaintext
WARNING 2026-07-07 10:20:00 files.delete Пользователь guest попытался удалить файл, к которому нет доступа
```

### Административное действие


```plaintext
INFO 2026-07-07 10:25:00 admin.user_toggle_admin Администратор admin изменил права пользователя john на is_admin=True
```

### Ошибка сервера


```plaintext
ERROR 2026-07-07 10:30:00 files.upload Ошибка записи файла на диск: [Errno 13] Permission denied
```

---