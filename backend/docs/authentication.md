# Аутентификация и права доступа в бэкенде «My Cloud»

В этом документе описаны механизмы аутентификации, защиты от CSRF, настройки CORS и проверка прав доступа.

<details>
<summary>📚 Оглавление</summary>

- [Аутентификация и права доступа в бэкенде «My Cloud»](#аутентификация-и-права-доступа-в-бэкенде-my-cloud)
  - [Сессионная аутентификация](#сессионная-аутентификация)
  - [CORS (Cross-Origin Resource Sharing)](#cors-cross-origin-resource-sharing)
  - [CSRF (Cross-Site Request Forgery)](#csrf-cross-site-request-forgery)
  - [Проверка прав доступа](#проверка-прав-доступа)
    - [1. Аутентификация (`IsAuthenticated`)](#1-аутентификация-isauthenticated)
    - [2. Права администратора](#2-права-администратора)
    - [3. Доступ к файлам других пользователей (администратор)](#3-доступ-к-файлам-других-пользователей-администратор)
  - [Кастомное сообщение для неавторизованных пользователей](#кастомное-сообщение-для-неавторизованных-пользователей)

</details>

---

## Сессионная аутентификация

В проекте используется **сессионная аутентификация Django**. После успешного входа сервер устанавливает cookie `sessionid`, которая автоматически отправляется браузером при последующих запросах.

**Как это работает:**

1. Пользователь отправляет POST-запрос на `/api/login/` с логином и паролем.
2. Django проверяет учётные данные, и если они верны, создаёт сессию и устанавливает cookie `sessionid`.
3. При последующих запросах (например, к `/api/files/`) браузер автоматически отправляет эту cookie.
4. Django проверяет сессию и определяет, какой пользователь выполнил запрос.

**Настройки в `settings.py`:**


```python
# Сессионная аутентификация включена по умолчанию
SESSION_ENGINE = 'django.contrib.sessions.backends.db'
SESSION_COOKIE_AGE = 1209600  # 2 недели
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_SECURE = False  # в продакшене должен быть True
```

---

## CORS (Cross-Origin Resource Sharing)

Поскольку фронтенд и бэкенд работают на разных портах, необходимо разрешить кросс-доменные запросы. Для этого используется `django-cors-headers`.

**Настройки в `settings.py`:**


```python
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",   # фронтенд Vite в разработке
    "http://127.0.0.1:5173",
]

CORS_ALLOW_CREDENTIALS = True   # разрешить передачу cookie
```

**Почему `CORS_ALLOW_CREDENTIALS = True`:**  
Чтобы браузер мог отправлять cookie `sessionid` вместе с запросами. Без этого флага сессии не будут работать.

---

## CSRF (Cross-Site Request Forgery)

Django включает защиту от CSRF по умолчанию для всех POST-запросов. Однако для API, использующего сессионную аутентификацию, мы **отключаем CSRF** через кастомное middleware.

**Почему отключаем:**  
В SPA-приложениях (фронтенд на React) CSRF-токен сложно передавать в каждом запросе. Вместо этого мы полагаемся на `SameSite` cookie и ограничение доступа по источникам (CORS).

**Middleware в `api/middleware/csrf.py`:**


```python
from django.utils.deprecation import MiddlewareMixin

class DisableCSRFForAPIMiddleware(MiddlewareMixin):
    def process_request(self, request):
        if request.path.startswith('/api/'):
            setattr(request, '_dont_enforce_csrf_checks', True)
```

**Подключение в `settings.py`:**


```python
MIDDLEWARE = [
    ...
    'api.middleware.csrf.DisableCSRFForAPIMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',   # оставлен для админки и других частей
    ...
]
```

**Важно:** CSRF-защита остаётся активной для админки и других частей Django, не относящихся к API.

---

## Проверка прав доступа

Права доступа проверяются на уровне представлений (handlers) с помощью DRF `permission_classes` и декораторов.

### 1. Аутентификация (`IsAuthenticated`)
Большинство эндпоинтов требуют, чтобы пользователь был авторизован.

Пример в `files/list.py`:


```python
from rest_framework.permissions import IsAuthenticated

class FileListView(APIView):
    permission_classes = [IsAuthenticated]
    ...
```

### 2. Права администратора
Для административных эндпоинтов (список пользователей, удаление, изменение прав) добавляется проверка `request.user.is_admin`.

Пример в `admin/user_list.py`:


```python
class AdminUserListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_admin:
            return Response({"error": "Доступ запрещён. Требуются права администратора."}, status=403)
        ...
```

### 3. Доступ к файлам других пользователей (администратор)
В эндпоинте `/api/files/` администратор может передать параметр `user_id`, чтобы просмотреть файлы другого пользователя.

Пример в `files/list.py`:


```python
class FileListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_id = request.query_params.get('user_id')

        if user.is_admin and user_id:
            target_user = CustomUser.objects.get(id=user_id)
            files = File.objects.filter(user=target_user)
        else:
            files = File.objects.filter(user=user)
        ...
```

---

## Кастомное сообщение для неавторизованных пользователей

Вместо стандартного сообщения DRF `{"detail": "Authentication credentials were not provided."}` мы возвращаем понятное пользователю сообщение.

**Обработчик в `api/exceptions/exception_handler.py`:**


```python
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None and response.status_code == 403:
        response.data = {"detail": "Вы не авторизованы. Пожалуйста, войдите."}
    return response
```

**Подключение в `settings.py`:**


```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
    ],
    'EXCEPTION_HANDLER': 'api.exceptions.exception_handler.custom_exception_handler',
}
```

Теперь при попытке доступа к защищённому ресурсу без сессии пользователь получит сообщение: *«Вы не авторизованы. Пожалуйста, войдите.»*

---