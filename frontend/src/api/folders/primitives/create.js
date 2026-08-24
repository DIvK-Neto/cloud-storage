import api from '../../axios';

/**
 * Создать новую папку.
 * @param {string} name - Имя папки.
 * @param {number|null} parentId - ID родительской папки (null — корневая).
 * @returns {Promise} Ответ от сервера с данными созданной папки.
 */
export const createFolder = (name, parentId = null) => {
    // Бэкенд ожидает поле 'parent'
    return api.post('/folders/create/', { name, parent: parentId });
};