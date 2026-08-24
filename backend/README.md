# Бэкенд облачного хранилища «My Cloud»

[![CI/CD](https://github.com/DIvK-Neto/cloud-storage/actions/workflows/web.yml/badge.svg)](https://github.com/DIvK-Neto/cloud-storage/actions/workflows/web.yml)

Бэкенд-часть веб-приложения для управления файлами в облаке. Реализована на Django и Django REST Framework, использует PostgreSQL для хранения данных.

---

## 📚 Документация

### Связанные файлы
- [Общий README проекта](../README.md) — общее описание, ссылки на фронтенд и деплой.
- [Фронтенд (React)](../frontend/README.md) — клиентская часть приложения.
- [Развёртывание на reg.ru](../docs/deployment-regru.md) — инструкция по деплою.

### Документация по бэкенду
- [Установка и запуск бэкенда](docs/installation.md) — пошаговая инструкция.
- [API-эндпоинты](docs/api-endpoints.md) — полный список всех эндпоинтов с примерами.
- [Модели данных](docs/models.md) — описание моделей (CustomUser, Folder, File, ShareLink, GuestComment, LogEntry).
- [Архитектура бэкенда](docs/architecture.md) — структура проекта, модули, core, apps, api.
- [Аутентификация и права доступа](docs/authentication.md) — сессии, CORS, CSRF, проверка прав.
- [Логирование](docs/logging.md) — настройка, уровни, форматы, запись в файлы и БД.

---

## 🛠️ Технологии

- **Python** 3.13
- **Django** 6.0
- **Django REST Framework** 3.17
- **PostgreSQL** 17
- **psycopg2** (бинарная версия)
- **django-cors-headers**
- **python-dotenv**

Полный список зависимостей — в `requirements.txt`.

---

## 📦 Быстрый старт

Краткая инструкция по запуску (подробная — в [docs/installation.md](docs/installation.md)):

1. Клонировать репозиторий.
2. Создать виртуальное окружение и активировать.
3. Установить зависимости: `pip install -r requirements.txt`.
4. Настроить `.env` (скопировать из `.env.example`).
5. Создать БД PostgreSQL и применить миграции: `python manage.py migrate`.
6. Создать суперпользователя: `python manage.py createsuperuser`.
7. Запустить сервер: `python manage.py runserver`.

---

## 👤 Автор

[DIvK-Neto](https://github.com/DIvK-Neto)
