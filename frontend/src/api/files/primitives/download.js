import api from '../../axios';

/**
 * Скачать файл по ID.
 * @param {number} fileId - ID файла.
 * @returns {Promise} Ответ с blob-данными файла.
 */
export const downloadFile = (fileId) => {
    return api.get(`/files/${fileId}/download/`, {
        responseType: 'blob',
    });
};
