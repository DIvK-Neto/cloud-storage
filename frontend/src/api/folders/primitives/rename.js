import api from '../../axios';

/**
 * Переименовать папку.
 * @param {number} folderId - ID папки.
 * @param {string} newName - Новое имя папки.
 * @returns {Promise} Ответ от сервера.
 */
export const renameFolder = (folderId, newName) => {
    return api.patch(`/folders/${folderId}/rename/`, { name: newName });
};