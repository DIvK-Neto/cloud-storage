import api from '../../axios';

/**
 * Окончательно удалить элемент из корзины (без возможности восстановления).
 * @param {number} id - ID элемента
 * @param {string} type - 'file' или 'folder'
 * @returns {Promise} Ответ с сообщением
 */
export const permanentDeleteTrashItem = (id, type) => {
    return api.delete(`/trash/${id}/permanent/?type=${type}`);
};