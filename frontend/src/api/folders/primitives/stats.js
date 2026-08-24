import api from '../../axios';

/**
 * Получить статистику для конкретной папки.
 * @param {number} folderId - ID папки.
 * @returns {Promise} - { folders_count, files_count, total_size }
 */
export const getFolderStats = (folderId) => {
    return api.get(`/folders/${folderId}/stats/`);
};