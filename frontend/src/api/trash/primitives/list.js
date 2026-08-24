import api from '../../axios';

/**
 * Получить список всех удалённых элементов (файлов и папок) текущего пользователя.
 * @param {Object} params - параметры запроса
 * @param {string} params.search - поисковый запрос (по имени)
 * @param {number} params.page - номер страницы
 * @param {number} params.pageSize - количество элементов на странице
 * @param {string} params.ordering - поле для сортировки (например, 'name', '-deleted_at', 'size')
 * @param {string} params.type - фильтр по типу ('files' или 'folders')
 * @returns {Promise} Ответ с пагинированным списком элементов
 */
export const getTrashList = (params = {}) => {
    const { search, page, pageSize, ordering, type } = params;  // <-- добавлен type
    const queryParams = {};

    if (search) queryParams.search = search;
    if (page) queryParams.page = page;
    if (pageSize) queryParams.page_size = pageSize;
    if (ordering) queryParams.ordering = ordering;
    if (type) queryParams.type = type;  // <-- добавлено

    return api.get('/trash/', { params: queryParams });
};