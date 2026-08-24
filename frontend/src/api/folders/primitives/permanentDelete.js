import api from '../../axios';

/**
 * Окончательное удаление папки (безвозвратно, с диска и из БД, рекурсивно)
 * @param {number} id - ID папки
 * @returns {Promise} Ответ с сообщением
 */
export const permanentDeleteFolder = (id) => {
    return api.delete(`/folders/${id}/permanent-delete/`);
};