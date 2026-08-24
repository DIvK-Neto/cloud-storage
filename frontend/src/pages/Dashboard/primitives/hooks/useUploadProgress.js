import { useState, useCallback } from 'react';

/**
 * Хук для управления прогрессом загрузки файлов.
 * @returns {Object} Состояние прогресса и функции для управления им.
 */
export const useUploadProgress = () => {
    const [uploadProgress, setUploadProgress] = useState({});

    /**
     * Установить прогресс для конкретного файла.
     * @param {string} fileName - Имя файла (ключ).
     * @param {number} percent - Процент загрузки (0-100).
     */
    const setProgress = useCallback((fileName, percent) => {
        setUploadProgress((prev) => ({
            ...prev,
            [fileName]: percent,
        }));
    }, []);

    /**
     * Удалить запись о прогрессе для файла (после завершения).
     * @param {string} fileName - Имя файла.
     */
    const clearProgress = useCallback((fileName) => {
        setUploadProgress((prev) => {
            const newState = { ...prev };
            delete newState[fileName];
            return newState;
        });
    }, []);

    /**
     * Получить текущий прогресс для файла.
     * @param {string} fileName - Имя файла.
     * @returns {number|undefined} Процент или undefined, если нет данных.
     */
    const getProgress = useCallback((fileName) => uploadProgress[fileName], [uploadProgress]);

    /**
     * Сбросить весь прогресс (например, после закрытия модалки).
     */
    const resetAllProgress = useCallback(() => {
        setUploadProgress({});
    }, []);

    return {
        uploadProgress,
        setProgress,
        clearProgress,
        getProgress,
        resetAllProgress,
    };
};
