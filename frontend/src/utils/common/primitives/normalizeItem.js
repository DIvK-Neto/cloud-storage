/**
 * Приводит объект файла или папки к единому формату.
 * @param {Object} item - объект от сервера (файл или папка)
 * @returns {Object} - нормализованный объект с полями:
 *   id, name, type, size, date, has_share_link, original (сырые данные)
 */
export const normalizeItem = (item) => {
    // Определяем тип
    const type = item.type || (item.original_name ? 'file' : 'folder');

    // ID
    const id = item.id || null;

    // Имя: для файлов берём original_name, для папок name
    const name = type === 'file'
        ? (item.original_name || item.name || 'Без имени')
        : (item.name || 'Без имени');

    // Размер: для папок 0
    const size = type === 'file' ? (item.size || 0) : 0;

    // Дата: для файлов upload_date, для папок created_at
    const date = type === 'file'
        ? (item.upload_date || item.uploaded_at || item.created_at || null)
        : (item.created_at || item.upload_date || item.uploaded_at || null);

    // Флаг наличия ссылки
    const has_share_link = item.has_share_link === true;

    return {
        id,
        name,
        type,
        size,
        date,
        has_share_link,
        original: item,
    };
};

/**
 * Нормализует массив элементов.
 * @param {Array} items - массив объектов от сервера
 * @returns {Array} - массив нормализованных объектов
 */
export const normalizeItems = (items) => {
    if (!Array.isArray(items)) return [];
    return items.map(normalizeItem);
};