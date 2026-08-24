import api from '../../axios';

/**
 * Переименовать файл.
 * @param {number} fileId - ID файла.
 * @param {string} newName - Новое имя файла.
 * @returns {Promise} Ответ от сервера.
 */
export const renameFile = (fileId, newName) => {
    return api.patch(`/files/${fileId}/rename/`, { new_name: newName });
};
