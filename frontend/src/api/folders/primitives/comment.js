import api from '../../axios';

/**
 * Обновить описание папки (PATCH /folders/<id>/comment/)
 * @param {number} folderId - ID папки
 * @param {string} description - новое описание
 * @returns {Promise} ответ сервера с обновлённой папкой
 */
export const updateFolderComment = (folderId, description) => {
    return api.patch(`/folders/${folderId}/comment/`, { description });
};