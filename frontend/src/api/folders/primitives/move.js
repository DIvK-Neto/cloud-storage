import api from '../../axios';

/**
 * Переместить папку в другую папку.
 * @param {number} folderId - ID папки.
 * @param {number|null} newParentId - ID новой родительской папки (null — корневая).
 * @returns {Promise} Ответ от сервера.
 */
export const moveFolder = (folderId, newParentId) => {
    // Для корня передаём 0, для папки — её ID
    const parent = newParentId === null ? 0 : newParentId;
    return api.patch(`/folders/${folderId}/move/`, { parent: parent });
};