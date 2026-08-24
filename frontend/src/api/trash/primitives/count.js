import api from '../../axios';

/**
 * Получить количество элементов в корзине текущего пользователя
 * @returns {Promise} Ответ с количеством файлов и папок
 */
export const getTrashCount = () => {
    return api.get('/trash/count/');
};