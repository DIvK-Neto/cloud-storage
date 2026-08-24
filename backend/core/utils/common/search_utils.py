from django.db.models import Sum, Q
from apps.files_app.model_definitions.all_models import File, Folder


def get_file_type(filename):
    ext = filename.split('.')[-1].lower() if '.' in filename else ''
    image_exts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico']
    doc_exts = ['pdf', 'doc', 'docx', 'xls',
                'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'odt']
    video_exts = ['mp4', 'avi', 'mkv', 'mov', 'wmv', 'flv', 'webm']
    audio_exts = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a']
    archive_exts = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2']
    if ext in image_exts:
        return 'images'
    elif ext in doc_exts:
        return 'documents'
    elif ext in video_exts:
        return 'videos'
    elif ext in audio_exts:
        return 'audio'
    elif ext in archive_exts:
        return 'archives'
    else:
        return 'other'


def get_all_subfolders(folder):
    """Рекурсивно возвращает все подпапки папки (включая саму папку)."""
    subfolders = [folder]
    for child in Folder.objects.filter(parent=folder):
        subfolders.extend(get_all_subfolders(child))
    return subfolders


def build_path(folder):
    """Строит полный путь к папке от корня."""
    if folder is None:
        return ''
    parts = []
    current = folder
    while current:
        parts.append(current.name)
        current = current.parent
    return '/'.join(reversed(parts))


def search_items(user, folder_id=None, search='', ordering='name', include_trash=False,
                 search_mode='current', case_sensitive=False, match_mode='contains', item_type='all'):
    """
    Универсальная функция поиска файлов и папок с поддержкой фильтров.
    
    Аргументы:
        user — пользователь
        folder_id — ID папки (None — корень)
        search — текст поиска
        ordering — сортировка ('name' или '-name')
        include_trash — True = искать в корзине, False = искать активные
        search_mode — 'current' (только текущая папка) или 'all' (все подпапки)
        case_sensitive — True/False (учёт регистра)
        match_mode — 'contains' (содержит) или 'exact' (точное)
        item_type — 'all', 'files', 'folders'
    
    Возвращает:
        (items, stats) — список элементов и статистика с полями:
            current_folders, current_files, current_size,
            total_folders, total_files, total_size,
            files_by_type
    """
    # Базовые запросы с учётом статуса
    if include_trash:
        files_qs = File.objects.filter(user=user, deleted_at__isnull=False)
        folders_qs = Folder.objects.filter(user=user, deleted_at__isnull=False)
    else:
        files_qs = File.objects.filter(user=user, deleted_at__isnull=True)
        folders_qs = Folder.objects.filter(user=user, deleted_at__isnull=True)

    # Определяем целевую папку
    target_folder = None
    if folder_id is not None:
        try:
            target_folder = Folder.objects.get(id=folder_id, user=user)
        except Folder.DoesNotExist:
            target_folder = None

    # Выбор типа поиска (регистронезависимый или регистрозависимый)
    if case_sensitive:
        if match_mode == 'exact':
            lookup = 'exact'
        else:
            lookup = 'contains'
    else:
        if match_mode == 'exact':
            lookup = 'iexact'
        else:
            lookup = 'icontains'

    # Фильтрация по имени
    def apply_search(queryset, name_field, lookup):
        if search:
            return queryset.filter(**{name_field + '__' + lookup: search})
        return queryset

    # --- Функции для сбора элементов и статистики ---
    def collect_items_and_stats(files_qs, folders_qs, target_folder, search_mode, include_trash):
        # Определяем наборы для текущей и общей статистики
        if target_folder:
            # Текущая папка
            current_files_qs = files_qs.filter(folder=target_folder)
            current_folders_qs = folders_qs.filter(parent=target_folder)
            # Все подпапки
            all_subfolders = get_all_subfolders(target_folder)
            total_files_qs = files_qs.filter(folder__in=all_subfolders)
            total_folders_qs = folders_qs.filter(parent__in=all_subfolders)
        else:
            if include_trash:
                # Корзина: все элементы считаются корневыми
                current_files_qs = files_qs
                current_folders_qs = folders_qs
                total_files_qs = files_qs
                total_folders_qs = folders_qs
            else:
                # Корень: текущие = корневые, total = все
                current_files_qs = files_qs.filter(folder__isnull=True)
                current_folders_qs = folders_qs.filter(parent__isnull=True)
                total_files_qs = files_qs
                total_folders_qs = folders_qs

        # Применяем поиск к текущим и общим наборам
        current_files_qs = apply_search(
            current_files_qs, 'original_name', lookup)
        current_folders_qs = apply_search(current_folders_qs, 'name', lookup)
        total_files_qs = apply_search(total_files_qs, 'original_name', lookup)
        total_folders_qs = apply_search(total_folders_qs, 'name', lookup)

        # Фильтр по типу элементов (применяется к списку, а не к статистике)
        # но для статистики мы тоже учитываем item_type (если item_type='files' или 'folders')
        if item_type == 'files':
            # Исключаем папки из статистики
            current_folders_qs = Folder.objects.none()
            total_folders_qs = Folder.objects.none()
        elif item_type == 'folders':
            current_files_qs = File.objects.none()
            total_files_qs = File.objects.none()

        # Подсчёт статистики
        current_folders = current_folders_qs.count()
        current_files = current_files_qs.count()
        current_size = current_files_qs.aggregate(Sum('size'))[
            'size__sum'] or 0

        total_folders = total_folders_qs.count()
        total_files = total_files_qs.count()
        total_size = total_files_qs.aggregate(Sum('size'))['size__sum'] or 0

        # Группировка по типам (для total файлов)
        files_by_type = {'images': 0, 'documents': 0,
                         'videos': 0, 'audio': 0, 'archives': 0, 'other': 0}
        for f in total_files_qs:
            ftype = get_file_type(f.original_name)
            files_by_type[ftype] += 1

        stats = {
            'current_folders': current_folders,
            'current_files': current_files,
            'current_size': current_size,
            'total_folders': total_folders,
            'total_files': total_files,
            'total_size': total_size,
            'files_by_type': files_by_type,
        }

        # --- Формирование списка элементов для таблицы ---
        # В зависимости от search_mode:
        # - если 'current' — только элементы из текущей папки
        # - если 'all' — все элементы из всех подпапок (с путями)
        if search_mode == 'current':
            final_files = current_files_qs
            final_folders = current_folders_qs
            # Для текущего режима путь не нужен
            include_path = False
        else:  # 'all'
            final_files = total_files_qs
            final_folders = total_folders_qs
            # Пути добавляются всегда при режиме 'all'
            include_path = True

        # Применяем сортировку
        if ordering == '-name':
            final_files = final_files.order_by('-original_name')
            final_folders = final_folders.order_by('-name')
        else:
            final_files = final_files.order_by('original_name')
            final_folders = final_folders.order_by('name')

        # Сериализация
        file_data = []
        for f in final_files:
            item = {'type': 'file', 'id': f.id, 'name': f.original_name,
                    'size': f.size, 'deleted_at': f.deleted_at}
            if include_path:
                # Путь к папке, где лежит файл
                item['path'] = build_path(f.folder) if f.folder else ''
            file_data.append(item)

        folder_data = []
        for f in final_folders:
            item = {'type': 'folder', 'id': f.id, 'name': f.name,
                    'size': 0, 'deleted_at': f.deleted_at}
            if include_path:
                # Путь к самой папке
                item['path'] = build_path(f)
            folder_data.append(item)

        items = file_data + folder_data

        # Дополнительная сортировка после объединения
        if ordering in ['name', '-name']:
            reverse = (ordering == '-name')
            items.sort(key=lambda x: x.get('name', ''), reverse=reverse)

        # Если item_type=='files' или 'folders' — фильтруем итоговый список
        if item_type == 'files':
            items = [i for i in items if i['type'] == 'file']
        elif item_type == 'folders':
            items = [i for i in items if i['type'] == 'folder']

        return items, stats

    return collect_items_and_stats(files_qs, folders_qs, target_folder, search_mode, include_trash)
