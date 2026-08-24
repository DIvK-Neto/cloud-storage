import { useCallback } from 'react';
import { message } from 'antd';
import { downloadFile } from '../../../../api/all_api';

/**
 * Хук для скачивания файла.
 * @returns {Object} Функция handleDownloadFile.
 */
export const useDownload = () => {
    // Скачивание файла
    const handleDownloadFile = useCallback(async (fileId, fileName) => {
        try {
            const response = await downloadFile(fileId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            message.success('Скачивание начато');
        } catch (err) {
            const msg = err.response?.data?.detail || 'Ошибка скачивания';
            message.error(msg);
            throw err;
        }
    }, []);

    return {
        handleDownloadFile,
    };
};