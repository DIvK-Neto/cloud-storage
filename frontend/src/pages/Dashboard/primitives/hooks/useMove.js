import { useCallback } from 'react';
import { message } from 'antd';
import { moveFile } from '../../../../api/all_api';
import { moveFolder } from '../../../../api/all_api';

/**
 * Хук для перемещения элемента (файла или папки).
 * @param {number|null} currentFolderId - ID текущей папки.
 * @param {Function} removeItem - Функция удаления элемента из локального списка.
 * @param {Function} refreshStats - Функция обновления статистики (опционально).
 * @returns {Function} handleMoveItem.
 */
export const useMove = (currentFolderId, removeItem, refreshStats) => {
    const handleMoveItem = useCallback(
        async (item, newFolderId) => {
            try {
                if (item.type === 'folder') {
                    await moveFolder(item.id, newFolderId);
                } else {
                    await moveFile(item.id, newFolderId);
                }
                message.success('Перемещено');
                // Удаляем элемент из текущего списка (он перешёл в другую папку)
                removeItem(item.id, item.type);
                // Обновляем статистику, если функция передана
                if (refreshStats) {
                    await refreshStats();
                }
            } catch (err) {
                const msg = err.response?.data?.detail || 'Ошибка перемещения';
                message.error(msg);
                throw err;
            }
        },
        [removeItem, refreshStats]
    );

    return { handleMoveItem };
};