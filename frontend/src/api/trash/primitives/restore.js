import api from '../../axios';

/**
 * Восстановить элемент из корзины.
 * @param {number} id - ID элемента
 * @param {string} type - 'file' или 'folder'
 * @returns {Promise} Ответ с сообщением
 */
export const restoreTrashItem = (id, type) => {
    return api.post(`/trash/${id}/restore/?type=${type}`);
};