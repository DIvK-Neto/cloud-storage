import api from '../../axios';

/**
 * Изменить комментарий к файлу.
 * @param {number} fileId - ID файла.
 * @param {string} comment - Новый комментарий.
 * @returns {Promise} Ответ от сервера.
 */
export const updateFileComment = (fileId, comment) => {
    return api.patch(`/files/${fileId}/comment/`, { comment });
};
