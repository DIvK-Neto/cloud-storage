import api from '../../axios';

/**
 * Получить общую статистику всего хранилища пользователя.
 * @returns {Promise} - { folders_count, files_count, total_size }
 */
export const getStorageStats = () => {
    return api.get('/storage/stats/');
};