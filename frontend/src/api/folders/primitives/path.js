import api from '../../axios';

/**
 * Получить путь к папке от корня до текущей.
 * @param {number} folderId - ID папки.
 * @returns {Promise} - массив объектов { id, name } от корня до текущей папки.
 */
export const getFolderPath = (folderId) => {
    return api.get(`/folders/${folderId}/path/`);
};