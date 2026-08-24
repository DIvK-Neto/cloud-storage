import api from '../../axios';

/**
 * Удалить файл по ID.
 * @param {number} fileId - ID файла.
 * @returns {Promise} Ответ от сервера.
 */
export const deleteFile = (fileId) => {
    return api.delete(`/files/${fileId}/delete/`);
};
