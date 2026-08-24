import api from '../../axios';

/**
 * Создать специальную ссылку для доступа к файлу.
 * @param {number} fileId - ID файла.
 * @returns {Promise} Ответ с полем share_link (UUID).
 */
export const createShareLink = (fileId) => {
    return api.get(`/files/${fileId}/share/`);
};
