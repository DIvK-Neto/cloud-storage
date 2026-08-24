import api from '../../axios';

/**
 * Переместить файл в другую папку.
 * @param {number} fileId - ID файла.
 * @param {number|null} newFolderId - ID папки назначения (0 — корневая).
 * @returns {Promise} Ответ от сервера.
 */
export const moveFile = (fileId, newFolderId) => {
    // Для корня передаём 0, для папки — её ID
    const folderId = newFolderId === null ? 0 : newFolderId;
    return api.patch(`/files/${fileId}/move/`, { folder: folderId });
};