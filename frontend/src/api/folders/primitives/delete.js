import api from '../../axios';

/**
 * Удалить папку по ID.
 * @param {number} folderId - ID папки.
 * @returns {Promise} Ответ от сервера.
 */
export const deleteFolder = (folderId) => {
    return api.delete(`/folders/${folderId}/delete/`);
};
