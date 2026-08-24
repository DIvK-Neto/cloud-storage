import api from '../../axios';

/**
 * Очистить корзину (окончательно удалить все элементы).
 * @returns {Promise} Ответ с сообщением
 */
export const clearTrash = () => {
    return api.delete('/trash/clear/');
};