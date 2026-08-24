import api from '../../axios';

/**
 * Поиск по корзине (отдельный запрос, не влияет на страницу)
 * @param {string} query - текст поиска
 * @param {number} page - номер страницы
 * @param {number} pageSize - количество элементов на странице
 * @param {string} ordering - поле сортировки
 * @param {string} type - фильтр по типу ('files' или 'folders')
 * @returns {Promise} Ответ с пагинированным списком
 */
export const searchTrash = (query, page = 1, pageSize = 25, ordering = '-deleted_at', type = null) => {
    const params = {
        search: query || undefined,
        page: page,
        page_size: pageSize,
        ordering: ordering,
    };
    if (type && type !== 'all') {
        params.type = type;
    }
    return api.get('/trash/', { params });
};