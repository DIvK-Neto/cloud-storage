import api from '../../axios';

/**
 * Получить список файлов пользователя.
 * @param {number|null} folderId - ID папки для фильтрации (если null — корневая папка).
 * @returns {Promise} Ответ с массивом файлов.
 */
export const listFiles = (folderId = null) => {
    const params = folderId ? { folder: folderId } : {};
    return api.get('/files/', { params });
};
