# Структура фронтенда (frontend/) – актуальная на 21.08.2026

## Полное дерево папок и файлов (с пояснениями для каждой строки)


```plaintext
frontend/                                                      # Корневая папка фронтенда
├── .oxlintrc.json                                            # Конфиг линтера Oxlint (правила проверки кода)
├── index.html                                                # Главный HTML-файл, точка входа приложения
├── package-lock.json                                         # Фиксация версий зависимостей (не редактируется вручную)
├── package.json                                              # Файл с зависимостями, скриптами и метаданными проекта
├── README.md                                                 # Документация по фронтенду
├── vite.config.js                                            # Конфигурация Vite (прокси, плагины, настройки сборки)
├── docs/                                                     # Папка с документацией по структуре фронтенда
│   └── frontend_structure_08-21.md                           # Актуальная структура (обновлена до 21.08.2026)
├── public/                                                   # Статические ресурсы, доступные по прямым ссылкам
│   ├── favicon.svg                                           # Иконка вкладки браузера
│   └── icons.svg                                             # SVG-спрайт иконок для использования в компонентах
└── src/                                                      # Исходный код приложения
    ├── App.css                                               # Глобальные стили для главного компонента App
    ├── App.jsx                                               # Главный компонент, оборачивает приложение в провайдеры (роутинг, контексты)
    ├── index.css                                             # Глобальные стили (сброс, переменные CSS) – исправлены отступы
    ├── main.jsx                                              # Точка входа React (рендер App с провайдерами Auth, Settings, Task)
    ├── api/                                                  # Слой взаимодействия с бэкендом (API-запросы)
    │   ├── all_api.js                                        # Сборщик всех API-функций (экспортирует всё из подпапок)
    │   ├── axios.js                                          # Настроенный экземпляр axios (baseURL, withCredentials, интерцепторы)
    │   ├── admin/                                            # Административные API (только для админов)
    │   │   ├── collections/admin.js                          # Сборщик административных API
    │   │   └── primitives/                                   # Примитивы API-вызовов
    │   │       ├── userDelete.js                             # DELETE /admin/users/<id>/delete/ – удаление пользователя
    │   │       ├── userList.js                               # GET /admin/users/ – список всех пользователей
    │   │       └── userToggleAdmin.js                        # PATCH /admin/users/<id>/toggle-admin/ – изменение прав админа
    │   ├── auth/                                             # API аутентификации
    │   │   ├── collections/auth.js                           # Сборщик API аутентификации
    │   │   └── primitives/                                   # Примитивы
    │   │       ├── checkEmail.js                             # GET /check-email/?email= – проверка занятости email
    │   │       ├── checkLogin.js                             # GET /check-login/?login= – проверка занятости логина
    │   │       ├── login.js                                  # POST /login/ – вход
    │   │       ├── logout.js                                 # POST /logout/ – выход
    │   │       └── register.js                               # POST /register/ – регистрация
    │   ├── dashboard/                                        # API для Dashboard
    │   │   ├── collections/dashboard.js                      # Сборщик API Dashboard (экспортирует search.js)
    │   │   └── primitives/search.js                          # API-функция для поиска на Dashboard (с фильтрами)
    │   ├── files/                                            # API для файлов
    │   │   ├── collections/files.js                          # Сборщик API файлов
    │   │   └── primitives/                                   # Примитивы
    │   │       ├── comment.js                                # PATCH /files/<id>/comment/ – обновление комментария
    │   │       ├── createLink.js                             # GET /files/<id>/share/ – создание ссылки (устаревший)
    │   │       ├── delete.js                                 # DELETE /files/<id>/delete/ – удаление файла
    │   │       ├── download.js                               # GET /files/<id>/download/ – скачивание файла
    │   │       ├── list.js                                   # GET /files/ – список файлов (с фильтром по папке)
    │   │       ├── move.js                                   # PATCH /files/<id>/move/ – перемещение файла
    │   │       ├── rename.js                                 # PATCH /files/<id>/rename/ – переименование файла
    │   │       └── upload.js                                 # POST /files/upload/ – загрузка файла
    │   ├── folders/                                          # API для папок
    │   │   ├── collections/folders.js                        # Сборщик API папок
    │   │   └── primitives/                                   # Примитивы
    │   │       ├── comment.js                                # PATCH /folders/<id>/comment/ – обновление описания папки
    │   │       ├── create.js                                 # POST /folders/create/ – создание папки
    │   │       ├── delete.js                                 # DELETE /folders/<id>/delete/ – удаление папки
    │   │       ├── list.js                                   # GET /folders/ – список папок (параметры parent, all)
    │   │       ├── move.js                                   # PATCH /folders/<id>/move/ – перемещение папки
    │   │       ├── path.js                                   # GET /folders/<id>/path/ – получение пути (хлебные крошки)
    │   │       ├── rename.js                                 # PATCH /folders/<id>/rename/ – переименование папки
    │   │       └── stats.js                                  # GET /folders/<id>/stats/ – статистика папки
    │   ├── health/                                           # Health check API
    │   │   ├── collections/health.js                         # Сборщик
    │   │   └── primitives/healthCheck.js                     # GET /health/ – проверка работоспособности бэкенда
    │   ├── storage/                                          # Статистика хранилища
    │   │   ├── collections/storage.js                        # Сборщик
    │   │   └── primitives/stats.js                           # GET /storage/stats/ – общая статистика пользователя
    │   └── trash/                                            # API для корзины
    │       ├── collections/trash.js                          # Сборщик API корзины
    │       └── primitives/                                   # Примитивы
    │           ├── clear.js                                  # DELETE /trash/clear/ – очистка корзины
    │           ├── count.js                                  # GET /trash/count/ – количество элементов в корзине
    │           ├── list.js                                   # GET /trash/ – список удалённых элементов с поиском/пагинацией
    │           ├── permanentDelete.js                        # DELETE /trash/<id>/permanent/ – окончательное удаление
    │           ├── restore.js                                # POST /trash/<id>/restore/ – восстановление элемента
    │           └── search.js                                 # API-функция для поиска в Корзине (использует search_utils)
    ├── assets/                                               # Изображения и статические ресурсы
    │   ├── hero.png                                          # Изображение для главной страницы
    │   ├── react.svg                                         # Логотип React
    │   └── vite.svg                                          # Логотип Vite
    ├── components/                                           # Переиспользуемые компоненты
    │   ├── all_components.js                                 # Сборщик всех компонентов
    │   ├── navigation/                                       # Компоненты навигации
    │   │   ├── all_navigation.js                             # Сборщик навигационных компонентов
    │   │   ├── common/                                       # Общие элементы навигации
    │   │   │   ├── Logo.jsx                                  # Логотип (ссылка на главную страницу)
    │   │   │   ├── LogoutButton.jsx                          # Кнопка выхода из системы
    │   │   │   ├── MenuItems.jsx                             # Выпадающее меню (гамбургер)
    │   │   │   └── UserAvatar.jsx                            # Аватар пользователя с именем и короной админа
    │   │   └── Navbar/                                       # Основная панель навигации
    │   │       ├── all_navbar.js                             # Сборщик компонентов Navbar
    │   │       ├── Navbar.css                                # Стили для Navbar
    │   │       ├── Navbar.jsx                                # Компонент Navbar
    │   │       ├── collections/navbar.js                     # Экспорт Navbar
    │   │       └── primitives/hooks/useNavbar.js             # Хук для логики Navbar (открытие/закрытие меню, выход)
    │   └── ui/                                               # UI-компоненты (кнопки, панели, поля)
    │       ├── all_ui.js                                     # Сборщик всех UI-компонентов
    │       ├── ActionPanel/                                  # Панель действий (sticky, закрепление, адаптивность)
    │       │   ├── ActionPanel.css                           # Стили – (адаптивность: 2 строки, кнопка «Ещё»)
    │       │   ├── ActionPanel.jsx                           # Основной компонент – (использует useActionPanelResponsive)
    │       │   ├── all_actionPanel.js                        # Сборщик
    │       │   ├── collections/actionPanel.js                # Экспорт компонента
    │       │   └── elements/                                 # Части панели
    │       │       ├── ActionButton.jsx                      # Одна кнопка с иконкой и тултипом
    │       │       ├── ActionButtons.jsx                     # Группа кнопок действий – обновлён (принимает unfinishedKeys)
    │       │       ├── MockSelector.jsx                      # Выпадающий список для имитации незавершённого действия
    │       │       ├── MockWidgetButton.jsx                  # Кнопка имитации виджета (создание тестовых задач)
    │       │       └── PinButton.jsx                         # Кнопка закрепления панели (сохраняется в localStorage)
    │       ├── AdminRoute/                                   # Защита админских маршрутов
    │       │   ├── AdminRoute.jsx                            # Компонент-обёртка
    │       │   ├── all_adminRoute.js                         # Сборщик
    │       │   ├── collections/adminRoute.js                 # Экспорт
    │       │   └── primitives/useAdminCheck.js               # Хук проверки прав администратора
    │       ├── BaseModal/                                    # Единый каркас для всех модалок
    │       │   ├── all_BaseModal.js                          # Сборщик
    │       │   ├── BaseModal.css                             # Стили (фиксация заголовка/подвала, прокрутка тела)
    │       │   ├── BaseModal.jsx                             # Основной компонент – обновлён (добавлен проп onCancel)
    │       │   ├── collections/                              # Сборщики примитивов (используются в хуках)
    │       │   │   ├── filterUtils.js                        # Сборщик фильтров
    │       │   │   ├── initialState.js                       # Сборщик начального состояния
    │       │   │   ├── sortUtils.js                          # Сборщик сортировок
    │       │   │   └── statusConstants.js                    # Сборщик констант статусов
    │       │   ├── elements/                                 # Части модалки (JSX)
    │       │   │   ├── ModalBody.jsx                         # Тело модалки (содержит фильтры и children)
    │       │   │   ├── ModalFooter.jsx                       # Подвал (кнопки действия и отмены)
    │       │   │   ├── ModalHeader.jsx                       # Заголовок (заголовок + иконки ⚙️ ❓ ✕)
    │       │   │   └── ModalTable.jsx                        # Общая таблица для модалок (сортировка, фильтр)
    │       │   ├── primitives/                               # Чистые функции и константы (без хуков)
    │       │   │   ├── filterUtils/                          # Функции фильтрации
    │       │   │   │   ├── filterByDate.js                   # Фильтр по диапазону дат
    │       │   │   │   ├── filterByName.js                   # Фильтр по имени (поиск)
    │       │   │   │   ├── filterByStatus.js                 # Фильтр по статусу (проблемные)
    │       │   │   │   └── filterByType.js                   # Фильтр по типу (файл/папка)
    │       │   │   ├── initialState/                         # Начальные состояния
    │       │   │   │   └── modalState.js                     # Начальное состояние модалки (isOpen, items и т.д.)
    │       │   │   ├── sortUtils/                            # Функции сортировки
    │       │   │   │   ├── sortByDate.js                     # Сортировка по дате
    │       │   │   │   ├── sortByName.js                     # Сортировка по имени
    │       │   │   │   ├── sortBySize.js                     # Сортировка по размеру
    │       │   │   │   └── sortByStatus.js                   # Сортировка по статусу
    │       │   │   └── statusConstants/                      # Константы статусов
    │       │   │       └── constants.js                      # Константы статусов (✅, ⚠️, ❌, ⏳)
    │       │   └── use/                                      # Хуки для управления состоянием модалки
    │       │       ├── useBaseModal.js                       # Главный хук-координатор (объединяет фильтр, сортировку, состояние)
    │       │       ├── useModalFilter.js                     # Хук для управления фильтрацией
    │       │       ├── useModalSort.js                       # Хук для управления сортировкой
    │       │       └── useModalState.js                      # Хук для базового состояния (открыто/закрыто, items)
    │       ├── common/                                       # Общие мелкие компоненты
    │       │   ├── SearchField/                              # Поле поиска (неконтролируемое, с восстановлением фокуса)
    │       │   │   └── SearchField.jsx                       # Компонент поля поиска
    │       │   └── SelectionCounter/                         # Компонент счётчика выбранных элементов
    │       │       ├── SelectionCounter.jsx                  # Отображение количества выбранных элементов
    │       │       └── primitives/countText.js               # Функция форматирования текста счётчика
    │       ├── ProgressWidget/                               # Виджет прогресса (доработан)
    │       │   ├── all_progressWidget.js                     # Сборщик
    │       │   ├── ProgressWidget.css                        # Стили виджета
    │       │   ├── ProgressWidget.jsx                        # Основной компонент (иконка + панель)
    │       │   ├── collections/progressWidget.js             # Экспорт
    │       │   └── elements/                                 # Части виджета
    │       │       ├── TaskCounter.jsx                       # Бейдж с количеством активных задач
    │       │       ├── TaskDetails.jsx                       # Детали задачи – доработаны
    │       │       ├── TaskItem.jsx                          # Одна строка задачи (прогресс-бар, статус)
    │       │       ├── TaskList.jsx                          # Список задач для выбранной вкладки
    │       │       ├── TaskTabs.jsx                          # Вкладки (Все, Активные, Завершено, Ошибки)
    │       │       ├── WidgetIcon.jsx                        # Иконка виджета в правом нижнем углу
    │       │       └── WidgetPanel.jsx                       # Панель виджета (заголовок, вкладки, список)
    │       ├── ProtectedRoute/                               # Защита авторизованных маршрутов
    │       │   ├── all_protectedRoute.js                     # Сборщик
    │       │   ├── ProtectedRoute.jsx                        # Компонент-обёртка
    │       │   ├── collections/protectedRoute.js             # Экспорт
    │       │   └── primitives/useProtectedCheck.js           # Хук проверки авторизации
    │       └── SmartField/                                   # Универсальное поле ввода с валидацией
    │           ├── all_smartField.js                         # Сборщик
    │           ├── SmartField.css                            # Стили
    │           ├── SmartField.jsx                            # Основной компонент
    │           ├── collections/smartField.js                 # Экспорт
    │           ├── elements/TooltipIcon.jsx                  # Иконка-тултип для подсказок
    │           └── primitives/hooks/                         # Хуки для управления полем
    │               ├── useFieldFeedback.js                   # Управление подсказками под полем
    │               ├── useFieldLoading.js                    # Состояние загрузки (спиннер)
    │               ├── useFieldTooltip.js                    # Управление тултипом
    │               ├── useFieldValidation.js                 # Валидация поля на лету
    │               └── useSmartField.js                      # Главный хук-координатор
    ├── config/                                               # Конфигурация маршрутов и пунктов меню
    │   ├── all_config.js                                     # Сборщик всей конфигурации
    │   ├── menu/                                             # Пункты меню (для Navbar)
    │   │   ├── all_menu.js                                   # Сборщик
    │   │   ├── collections/                                  # Сборщики по ролям
    │   │   │   ├── admin.js                                  # Пункты для администратора
    │   │   │   ├── auth.js                                   # Пункты для авторизованных
    │   │   │   ├── common.js                                 # Публичные пункты
    │   │   │   └── dashboard.js                              # Пункты для Dashboard
    │   │   └── primitives/                                   # Примитивы (объекты пунктов)
    │   │       ├── admin/main.js                             # Объект маршрута /admin
    │   │       ├── auth/login.js                             # /login
    │   │       ├── auth/register.js                          # /register
    │   │       ├── common/home.js                            # /
    │   │       ├── common/logout.js                          # Выход (отдельный пункт)
    │   │       └── dashboard/main.js                         # /dashboard
    │   └── routes/                                           # Маршруты (объекты для React Router)
    │       ├── all_routes.js                                 # Сборщик
    │       ├── collections/                                  # Сборщики по ролям
    │       │   ├── admin.js                                  # Админские маршруты
    │       │   ├── auth.js                                   # Приватные маршруты
    │       │   ├── dashboard.js                              # Публичные маршруты
    │       │   └── pages.js                                  # Дополнительные страницы (Home и т.д.)
    │       └── primitives/                                   # Примитивы (объекты маршрутов)
    │           ├── admin/main.js
    │           ├── auth/login.js
    │           ├── auth/register.js
    │           ├── dashboard/main.js
    │           └── pages/home.js
    ├── context/                                              # Глобальные контексты React
    │   ├── all_context.js                                    # Сборщик
    │   ├── AuthContext.jsx                                   # Контекст аутентификации (провайдер, useAuth)
    │   ├── SettingsContext.jsx                               # Контекст настроек – обновлён (добавлены поля unfinishedActions, методы)
    │   ├── TaskContext.jsx                                   # Контекст задач (провайдер, useTask) – добавлены activeTab, setActiveTab
    │   └── collections/                                      # Сборщики (для экспорта)
    │       ├── auth.js                                       # Экспорт AuthContext
    │       └── settings.js                                   # Экспорт SettingsContext (устаревший, но оставлен)
    ├── hooks/                                                # Кастомные хуки
    │   ├── all_hooks.js                                      # Сборщик всех хуков
    │   ├── auth/                                             # Хуки аутентификации
    │   │   ├── all_auth.js                                   # Сборщик
    │   │   ├── collections/auth.js                           # Экспорт useAuth
    │   │   └── use/useAuth.js                                # Хук для работы с AuthContext
    │   └── common/                                           # Общие хуки (для Dashboard, ActionPanel, ProgressWidget и т.д.)
    │       ├── all_common.js                                 # Сборщик
    │       ├── taskQueueStore.js                             # Синглтон для задач (устаревший, но оставлен для совместимости)
    │       ├── collections/                                  # Сборщики примитивов и хуков
    │       │   ├── actionPanel.js                            # Сборщик для ActionPanel – обновлён
    │       │   ├── bulkActions.js                            # Сборщик для массовых действий
    │       │   ├── common.js                                 # Общие (useDebounce, useFieldCheck)
    │       │   ├── progressWidget.js                         # Сборщик для виджета
    │       │   ├── selection.js                              # Сборщик для выбора
    │       │   ├── taskQueue.js                              # Сборщик для задач
    │       │   └── unfinishedAction.js                       # Сборщик для незавершённых действий
    │       ├── primitives/                                   # Чистые функции (редьюсеры, экшены, селекторы)
    │       │   ├── actionPanel/isPanelVisible.js             # Функция видимости панели
    │       │   ├── bulkActions/                              # Массовые действия
    │       │   │   ├── bulkDelete.js                         # Массовое удаление
    │       │   │   ├── bulkDownload.js                       # Массовое скачивание
    │       │   │   └── bulkMove.js                           # Массовое перемещение
    │       │   ├── progressWidget/                           # Управление виджетом
    │       │   │   ├── closeWidget.js                        # Закрытие виджета
    │       │   │   ├── setActiveTab.js                       # Установка активной вкладки
    │       │   │   └── toggleExpanded.js                     # Разворачивание виджета
    │       │   ├── selection/                                # Управление выбором
    │       │   │   ├── clearSelection.js                     # Очистка выбора
    │       │   │   ├── isAllSelected.js                      # Проверка, выбраны ли все
    │       │   │   ├── isSelected.js                         # Проверка выбранного элемента
    │       │   │   ├── selectAll.js                          # Выбор всех элементов
    │       │   │   ├── selectedIds.js                        # Редьюсер для выбранных ID
    │       │   │   ├── setSelectedIds.js                     # Экшен установки выбранных ID
    │       │   │   └── toggleSelection.js                    # Переключение выбора элемента
    │       │   ├── taskQueue/                                # Управление задачами
    │       │   │   ├── addTask.js                            # Добавление задачи
    │       │   │   ├── clearCompleted.js                     # Очистка завершённых задач
    │       │   │   ├── completeTask.js                       # Завершение задачи (успех/ошибка)
    │       │   │   ├── getActiveTasks.js                     # Селектор активных задач
    │       │   │   ├── getAllTasks.js                        # Селектор всех задач
    │       │   │   ├── getCompletedTasks.js                  # Селектор завершённых задач (только done)
    │       │   │   ├── getErrorTasks.js                      # Селектор задач с ошибками
    │       │   │   ├── reducer.js                            # Редьюсер для задач
    │       │   │   └── updateTask.js                         # Обновление задачи (прогресс)
    │       │   └── unfinishedAction/                         # Незавершённые действия
    │       │       ├── blockOtherButtons.js                  # Блокировка остальных кнопок
    │       │       ├── clearUnfinished.js                    # Очистка незавершённого действия
    │       │       ├── getUnfinished.js                      # Получение незавершённого действия
    │       │       ├── hasUnfinished.js                      # Проверка наличия незавершённого действия
    │       │       └── setUnfinished.js                      # Установка незавершённого действия
    │       └── use/                                          # Хуки с логикой состояния (useState, useReducer)
    │           ├── useActionPanel.js                         # Хук для панели действий (использует SettingsContext)
    │           ├── useActionPanelResponsive.js               # Хук – управление адаптивностью панели
    │           ├── useDebounce.js                            # Хук задержки ввода (для проверки полей)
    │           ├── useFieldCheck.js                          # Хук проверки занятости логина/email
    │           ├── useProgressWidget.js                      # Хук состояния виджета (видимость, вкладка)
    │           ├── useSettings.js                            # Хук для доступа к SettingsContext
    │           ├── useTaskQueue.js                           # Хук для работы с задачами (использует редьюсер)
    │           └── useUnfinishedAction.js                    # Хук – управление незавершёнными действиями
    ├── pages/                                                # Страницы приложения
    │   ├── all_pages.js                                      # Сборщик всех страниц
    │   ├── Admin/                                            # Административная панель (заглушка)
    │   │   ├── AdminPanel.css                                # Стили админ-панели
    │   │   ├── AdminPanel.jsx                                # Компонент админ-панели
    │   │   ├── all_admin.js                                  # Сборщик
    │   │   └── collections/components.js                     # Экспорт AdminPanel
    │   ├── Dashboard/                                        # ★ Основная страница (файловый менеджер)
    │   │   ├── all_dashboard.js                              # Сборщик страницы (экспортирует Dashboard и хуки)
    │   │   ├── Dashboard.css                                 # Стили страницы – исправлены отступы
    │   │   ├── Dashboard.jsx                                 # ★ ИСПРАВЛЕН  – добавлены поиск и фильтры
    │   │   ├── collections/                                  # Сборщики
    │   │   │   ├── components.js                             # Экспорт Dashboard
    │   │   │   └── hooks.js                                  # Экспорт всех хуков Dashboard
    │   │   ├── elements/                                     # Части страницы (JSX)
    │   │   │   ├── all_elements.js                           # Сборщик элементов Dashboard
    │   │   │   ├── Breadcrumbs.jsx                           # Хлебные крошки (навигация по папкам)
    │   │   │   ├── DashboardContent.jsx                      # ★ ИСПРАВЛЕН  – передаёт isSearchActive и searchMode
    │   │   │   ├── DashboardHeader.jsx                       # ★ ИСПРАВЛЕН  – добавлены поле поиска и кнопка «Фильтр»
    │   │   │   ├── DashboardModals.jsx                       # Контейнер всех модалок
    │   │   │   ├── FileActionsMenu.jsx                       # Меню действий (троеточие) для строки таблицы
    │   │   │   ├── FileList.jsx                              # ★ ИСПРАВЛЕН – добавлена колонка «Путь»
    │   │   │   ├── FileListColumns.jsx                       # Сборщик колонок таблицы
    │   │   │   ├── FolderStats.jsx                           # Статистика текущей папки (две строки)
    │   │   │   ├── columns/                                  # Отдельные файлы для каждой колонки
    │   │   │   │   ├── ActionsColumn.jsx                     # Колонка "Действия" (меню)
    │   │   │   │   ├── CommentsColumn.jsx                    # Колонка "Комментарии" (иконка 💬, счётчик)
    │   │   │   │   ├── DateColumn.jsx                        # Колонка "Дата загрузки" (2 строки)
    │   │   │   │   ├── DescriptionColumn.jsx                 # Колонка "Описание" (✏️, 30 символов)
    │   │   │   │   ├── LinkColumn.jsx                        # Колонка "Ссылка" (🔗, только если есть ссылка)
    │   │   │   │   ├── NameColumn.jsx                        # Колонка "Имя" (резиновая, с иконкой папки/файла)
    │   │   │   │   └── SizeColumn.jsx                        # Колонка "Размер" (3 строки для папок)
    │   │   │   └── modals/                                   # Все модалки Dashboard
    │   │   │       ├── BulkRenameModal.jsx                   # Модалка массового переименования
    │   │   │       ├── ConfirmModal.jsx                      # Универсальная модалка подтверждения
    │   │   │       ├── CreateFolderModal.jsx                 # Создание папки
    │   │   │       ├── DownloadModal.jsx                     # Модалка скачивания (выбор формата, папки, пароля)
    │   │   │       ├── DownloadTable.jsx                     # Таблица в модалке скачивания
    │   │   │       ├── EditDescriptionModal.jsx              # Редактирование описания (с localStorage)
    │   │   │       ├── LinkSettings.jsx                      # Универсальные настройки ссылок
    │   │   │       ├── LinkTables.jsx                        # Таблицы ссылок (одиночные и коллекции)
    │   │   │       ├── ManageLinkModal.jsx                   # Управление ссылками (редактирование, таблицы)
    │   │   │       ├── MoveBulkSettings.jsx                  # Настройки массового перемещения
    │   │   │       ├── MoveBulkTable.jsx                     # Таблица массового перемещения
    │   │   │       ├── MoveModal.jsx                         # Перемещение (одиночное и массовое)
    │   │   │       ├── RenameBulkSettings.jsx                # Настройки массового переименования
    │   │   │       ├── RenameBulkTable.jsx                   # Таблица массового переименования
    │   │   │       ├── RenameModal.jsx                       # Одиночное переименование (из таблицы)
    │   │   │       ├── ShareModal.jsx                        # Создание ссылок – обновлён (onCancel)
    │   │   │       ├── ShareTable.jsx                        # Таблица в модалке «Поделиться» (статусы, ссылки)
    │   │   │       └── UploadModal.jsx                       # Загрузка файлов (с прогрессом)
    │   │   └── primitives/                                   # Локальные хуки и утилиты Dashboard
    │   │       ├── hooks/                                    # Основные хуки Dashboard
    │   │       │   ├── useComment.js                         # Универсальный хук для комментариев (файлы/папки)
    │   │       │   ├── useCreateFolder.js                    # Создание папки
    │   │       │   ├── useDashboardData.js                   # ★ ИСПРАВЛЕН  – поддержка поиска и фильтров
    │   │       │   ├── useDashboardSelection.js              # Управление выбором (чекбоксы)
    │   │       │   ├── useDelete.js                          # ★ ИСПРАВЛЕН  – вызывает refreshStats после удаления
    │   │       │   ├── useDownload.js                        # Скачивание одного файла
    │   │       │   ├── useMove.js                            # Перемещение (универсальное)
    │   │       │   ├── useNavigation.js                      # Навигация по папкам (хлебные крошки)
    │   │       │   ├── useRename.js                          # Переименование (универсальное)
    │   │       │   ├── useShare.js                           # Создание ссылок (универсальное, файлы/папки)
    │   │       │   ├── useStats.js                           # ★ ИСПРАВЛЕН – статистика папки/хранилища
    │   │       │   ├── useUpload.js                          # Загрузка файлов (с прогрессом)
    │   │       │   ├── useUploadProgress.js                  # Управление прогрессом загрузки
    │   │       │   ├── useTrashCount.js                      # Получение количества элементов в корзине
    │   │       │   └── useDashboardData/                     # Подпапка с частями useDashboardData
    │   │       │       ├── useDashboardDataFiles.js          # Сборщик действий для файлов
    │   │       │       ├── useDashboardDataFolders.js        # Сборщик действий для папок
    │   │       │       ├── useDashboardDataModals.js         # Модальные хуки
    │   │       │       ├── useDashboardDataNavigation.js     # Навигация (часть useDashboardData)
    │   │       │       ├── useDashboardDataSelection.js      # Выбор (часть useDashboardData)
    │   │       │       └── useDashboardDataStats.js          # Статистика (часть useDashboardData)
    │   │       └── modal_hooks/                              # Хуки для управления модалками
    │   │           ├── useBulkMoveModal.js                   # Управление массовым перемещением
    │   │           ├── useBulkRenameModal.js                 # Управление массовым переименованием
    │   │           ├── useCreateFolderModal.js               # Создание папки
    │   │           ├── useDeleteModal.js                     # Удаление
    │   │           ├── useDownloadModal.js                   # Управление модалкой скачивания
    │   │           ├── useEditDescriptionModal.js            # Редактирование описания
    │   │           ├── useEditLink.js                        # Логика редактирования ссылки
    │   │           ├── useManageLinkModal.js                 # Управление ссылками (список, открытие)
    │   │           ├── useMoveModal.js                       # Перемещение (одиночное)
    │   │           ├── useRenameModal.js                     # Переименование (одиночное)
    │   │           ├── useShareModal.js                      # Создание ссылок – обновлён (сохранение/восстановление)
    │   │           └── useUploadModal.js                     # Загрузка файлов
    │   ├── Home/                                             # Главная страница (лендинг)
    │   │   ├── all_home.js                                   # Сборщик
    │   │   ├── Home.css                                      # Стили главной страницы
    │   │   ├── Home.jsx                                      # Компонент главной страницы
    │   │   └── collections/components.js                     # Экспорт Home
    │   ├── Login/                                            # Страница входа
    │   │   ├── all_login.js                                  # Сборщик
    │   │   ├── Login.css                                     # Стили страницы входа
    │   │   ├── Login.jsx                                     # Компонент страницы входа
    │   │   ├── collections/                                  # Сборщики для страницы входа
    │   │   │   ├── components.js                             # Экспорт LoginForm
    │   │   │   ├── hooks.js                                  # Экспорт хуков страницы входа
    │   │   │   └── validators.js                             # Экспорт валидаторов страницы входа
    │   │   ├── elements/LoginForm.jsx                        # Форма входа (использует SmartField)
    │   │   └── primitives/                                   # Локальные хуки и утилиты
    │   │       ├── hooks/useLogin.js                         # Хук для логики входа
    │   │       └── validators/                               # Валидаторы
    │   │           ├── loginValidator.js                     # Валидатор логина (только обязательность)
    │   │           └── passwordValidator.js                  # Валидатор пароля (только обязательность)
    │   ├── Profile/                                          # Страница профиля (заглушка)
    │   │   ├── all_profile.js                                # Сборщик
    │   │   ├── Profile.css                                   # Стили профиля
    │   │   ├── Profile.jsx                                   # Компонент профиля
    │   │   └── collections/components.js                     # Экспорт Profile
    │   ├── Register/                                         # Страница регистрации
    │   │   ├── all_register.js                               # Сборщик
    │   │   ├── Register.css                                  # Стили регистрации
    │   │   ├── Register.jsx                                  # Компонент регистрации
    │   │   ├── collections/                                  # Сборщики для страницы регистрации
    │   │   │   ├── components.js                             # Экспорт RegisterForm
    │   │   │   ├── hooks.js                                  # Экспорт хуков регистрации
    │   │   │   └── validators.js                             # Экспорт валидаторов регистрации
    │   │   ├── elements/RegisterForm.jsx                     # Форма регистрации
    │   │   └── primitives/                                   # Локальные хуки и утилиты
    │   │       ├── hooks/useRegister.js                      # Хук для логики регистрации
    │   │       └── validators/                               # Валидаторы
    │   │           ├── emailValidator.js                     # Валидатор email
    │   │           ├── fullNameValidator.js                  # Валидатор полного имени
    │   │           ├── passwordValidator.js                  # Полная валидация пароля (для регистрации)
    │   │           └── usernameValidator.js                  # Валидатор логина
    │   ├── shared/                                           # Публичные страницы для ссылок
    │   │   ├── SharedCollectionView.jsx                      # Просмотр коллекции (скачивание ZIP)
    │   │   └── SharedFileView.jsx                            # Просмотр файла/папки по ссылке (скачивание)
    │   └── Trash/                                            # Страница Корзины
    │       ├── all_trash.js                                  # Сборщик страницы Корзины
    │       ├── Trash.css                                     # Стили страницы Корзины
    │       ├── Trash.jsx                                     # Главный компонент страницы Корзины (чистый рендеринг)
    │       ├── collections/                                  # Сборщики для страницы Корзины
    │       │   ├── components.js                             # Экспорт Trash
    │       │   └── hooks.js                                  # Экспорт хуков Корзины
    │       ├── elements/                                     # Части страницы Корзины (JSX)
    │       │   ├── all_elements.js                           # Сборщик элементов Корзины
    │       │   ├── TrashContent.jsx                          # Содержимое (статистика, таблица, панель действий)
    │       │   ├── TrashHeader.jsx                           # Заголовок (кнопка «Назад», поиск, кнопка «Очистить корзину»)
    │       │   ├── TrashList.jsx                             # Компонент таблицы Корзины
    │       │   └── TrashStats.jsx                            # Статистика Корзины (одна строка: Папок, Файлов, Размер, «Ещё»)
    │       └── primitives/                                   # Локальные хуки и утилиты Корзины
    │           └── hooks/                                    # Основные хуки Корзины
    │               └── useTrashData.js                       # Хук для управления данными Корзины (список, поиск, пагинация, сортировка, операции)
    ├── routing/                                               # React-маршруты (настройка путей)
    │   ├── all_routing.js                                     # Сборщик
    │   ├── routing.jsx                                        # Массив всех маршрутов (с redirect для *)
    │   ├── collections/routing.js                             # Экспорт маршрутов
    │   └── elements/                                          # Группы маршрутов
    │       ├── adminRouting.jsx                               # Админские маршруты
    │       ├── privateRouting.jsx                             # Приватные маршруты (для авторизованных) – добавлен /trash
    │       └── publicRouting.jsx                              # Публичные маршруты (включая /shared/*)
    └── utils/                                                 # Общие утилиты (форматирование, нормализация, хелперы)
        ├── all_utils.js                                       # Сборщик всех утилит
        └── common/                                            # Общие утилиты
            ├── all_common.js                                  # Сборщик общих утилит
            ├── collections/                                   # Сборщики утилит
            │   ├── common.js                                  # Экспорт formatters, fileUtils
            │   └── taskHelpers.js                             # Экспорт утилит для задач
            └── primitives/                                    # Примитивы утилит
                ├── fileUtils.js                               # Проверка дубликатов, генерация уникальных имён
                ├── formatters.js                              # Форматирование размера (formatFileSize)
                ├── normalizeItem.js                           # Нормализация объектов файлов/папок
                └── taskHelpers/                               # Утилиты для задач виджета прогресса
                    ├── createTask.js                          # Создание объекта задачи
                    ├── formatTaskTime.js                      # Форматирование времени выполнения задачи
                    ├── getOperationIcon.js                    # Иконка операции (⬆, ⬇, 🗑, 📁, 🔗, ✏️, 👁️)
                    ├── getStatusIcon.js                       # Иконка статуса (⏳, ✅, ❌)
                    └── getTaskStatusText.js                   # Текст статуса задачи
```
```
## Пояснения к обновлённой структуре

### Что изменилось (21.08.2026):

1. **Новая папка `api/dashboard/`**:
   - `collections/dashboard.js` — сборщик API для Dashboard (экспортирует search.js).
   - `primitives/search.js` — API-функция для поиска на Dashboard с поддержкой фильтров (search_mode, case_sensitive, match_mode, item_type).

2. **Обновлён `pages/Dashboard/Dashboard.jsx`**:
   - Добавлены состояния для поиска и фильтров: `searchQuery`, `searchStats`, `isSearching`, `searchMode`, `itemType`, `caseSensitive`, `matchMode`.
   - Добавлены функции: `performSearch` (основной запрос), `handleSearch` (обработчик ввода), `handleFilterChange` (обновление фильтров), `resetFilters` (сброс).
   - Добавлен `useEffect` для автоматического перезапуска поиска при изменении любого фильтра.
   - При смене папки поиск и фильтры сбрасываются.

3. **Обновлён `pages/Dashboard/elements/DashboardHeader.jsx`**:
   - Добавлено поле поиска (`SearchField`) между заголовком и кнопками.
   - Добавлена кнопка «Фильтр» (иконка) слева от поля поиска с выпадающей панелью настроек.
   - Панель фильтров содержит: режим поиска (текущая/все папки), тип элементов (все/папки/файлы), чекбокс «Учитывать регистр», тип совпадения (общее/точное), кнопку «Сбросить фильтры».
   - Добавлены тултипы для всех элементов фильтров.
   - Кнопка фильтра подсвечивается, если активны нестандартные фильтры.

4. **Обновлён `pages/Dashboard/elements/DashboardContent.jsx`**:
   - Передаёт новые пропсы `isSearchActive` и `searchMode` в `FileList`.

5. **Обновлён `pages/Dashboard/elements/FileList.jsx`**:
   - Добавлена динамическая колонка «Путь», которая появляется только при `searchMode === 'all'` и активном поиске.
   - Колонка отображает полный путь к элементу (от корня до папки).

6. **Обновлён `pages/Dashboard/primitives/hooks/useDashboardData.js`**:
   - Добавлена поддержка поиска и фильтров через `searchDashboard`.
   - В `useDashboardData` интегрированы состояния и функции для работы с поиском.

7. **Обновлён `pages/Dashboard/primitives/hooks/useStats.js`**:
   - Добавлен фильтр `deleted_at__isnull=True` во все запросы статистики (учёт только активных элементов).
   - Исправлены функции подсчёта статистики (исключены мягко удалённые элементы).

8. **Обновлён `pages/Dashboard/primitives/hooks/useDelete.js`**:
   - Добавлен вызов `refreshStats()` после успешного удаления для обновления статистики.

9. **Удалены файлы контекста поиска**:
   - `context/SearchContext.jsx`
   - `hooks/common/use/useSearch.js`
   - `hooks/common/collections/search.js`
   - Убраны все импорты и обёртки `SearchProvider` из `App.jsx`, `main.jsx`, `all_context.js`.

10. **Обновлён `api/trash/primitives/search.js`**:
    - Добавлена поддержка параметров фильтров (использует `search_utils` на бэкенде).
    - Теперь передаёт `search_mode`, `case_sensitive`, `match_mode`, `item_type` в запрос.

11. **Обновлён `backend/api/handlers/trash/list.py`**:
    - Переработан для использования общей утилиты `search_utils.py` (убрано дублирование кода).

12. **Создана общая утилита на бэкенде**:
    - `backend/core/utils/common/search_utils.py` — универсальная функция для поиска и статистики файлов и папок (активных и удалённых).
    - Поддерживает все фильтры и возвращает поле `path` при `search_mode='all'`.

---
