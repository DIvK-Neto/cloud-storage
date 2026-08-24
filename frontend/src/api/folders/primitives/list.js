import api from '../../axios';

/**
 * Получить список папок пользователя.
 * @param {number|null} parentId - ID родительской папки (если null — корневая).
 * @returns {Promise} Ответ с массивом папок.
 */
export const listFolders = (parentId = null) => {
    const params = parentId ? { parent: parentId } : {};
    return api.get('/folders/', { params });
};

/**
 * Получить все папки пользователя (без фильтрации по parent).
 * @returns {Promise} Ответ с массивом всех папок.
 */
export const listAllFolders = () => {
    return api.get('/folders/', { params: { all: true } });
};