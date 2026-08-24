import api from '../../axios';

/**
 * Загрузить файл в хранилище.
 * @param {File} file - Загружаемый файл.
 * @param {string} [comment] - Комментарий к файлу.
 * @param {number|null} [folderId] - ID папки назначения (если null — корневая).
 * @param {function} [onProgress] - Колбэк для отслеживания прогресса (получает процент).
 * @returns {Promise} Ответ от сервера.
 */
export const uploadFile = (file, comment = '', folderId = null, onProgress = null) => {
    const formData = new FormData();
    formData.append('file', file);
    if (comment) formData.append('comment', comment);
    if (folderId) formData.append('folder', folderId);

    return api.post('/files/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percent);
            }
        },
    });
};
