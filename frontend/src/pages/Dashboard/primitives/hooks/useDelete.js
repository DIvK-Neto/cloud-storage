import { useCallback } from 'react';
import { message } from 'antd';
import { deleteFile } from '../../../../api/all_api';
import { deleteFolder } from '../../../../api/all_api';

/**
 * Хук для удаления элемента (файла или папки).
 * @param {number|null} currentFolderId - ID текущей папки.
 * @param {Function} removeItem - Функция удаления элемента из локального списка.
 * @param {Function} refreshStats - Функция обновления статистики (опционально).
 * @returns {Function} handleDeleteItem.
 */
export const useDelete = (currentFolderId, removeItem, refreshStats) => {
    const handleDeleteItem = useCallback(
        async (item) => {
            try {
                if (item.type === 'folder') {
                    await deleteFolder(item.id);
                } else {
                    await deleteFile(item.id);
                }
                message.success('Удалено');
                // Обновляем локальный список
                removeItem(item.id, item.type);
                // Обновляем статистику, если функция передана
                if (refreshStats) {
                    await refreshStats();
                }
            } catch (err) {
                const msg = err.response?.data?.detail || 'Ошибка удаления';
                message.error(msg);
                throw err;
            }
        },
        [removeItem, refreshStats]
    );

    return { handleDeleteItem };
};