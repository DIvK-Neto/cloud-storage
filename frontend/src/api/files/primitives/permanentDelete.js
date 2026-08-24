import api from '../../axios';

/**
 * Окончательное удаление файла (безвозвратно, с диска и из БД)
 * @param {number} id - ID файла
 * @returns {Promise} Ответ с сообщением
 */
export const permanentDeleteFile = (id) => {
    return api.delete(`/files/${id}/permanent-delete/`);
};