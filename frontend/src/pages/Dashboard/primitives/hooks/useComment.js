import { useCallback } from 'react';
import { message } from 'antd';
import { updateFileComment } from '../../../../api/all_api';
import { updateFolderComment } from '../../../../api/folders/collections/folders';

/**
 * Универсальный хук для обновления описания (комментария) файла или папки.
 * @param {number|null} currentFolderId - ID текущей папки (не используется, оставлен для совместимости).
 * @param {Function} updateItem - Функция обновления элемента в локальном списке.
 * @param {Function} refreshStats - Функция обновления статистики (опционально).
 * @returns {Object} Функция handleUpdateComment.
 */
export const useComment = (currentFolderId, updateItem, refreshStats) => {
    const handleUpdateComment = useCallback(
        async (item, newComment) => {
            try {
                let updatedItem;
                if (item.type === 'folder') {
                    await updateFolderComment(item.id, newComment);
                    updatedItem = { ...item, description: newComment };
                    message.success('Описание папки обновлено');
                } else {
                    await updateFileComment(item.id, newComment);
                    updatedItem = { ...item, comment: newComment };
                    message.success('Комментарий файла обновлён');
                }
                // Обновляем локальный элемент
                updateItem(updatedItem);
                // Обновляем статистику, если функция передана
                if (refreshStats) {
                    await refreshStats();
                }
            } catch (err) {
                const msg = err.response?.data?.detail || 'Ошибка обновления описания';
                message.error(msg);
                throw err;
            }
        },
        [updateItem, refreshStats]
    );

    return { handleUpdateComment };
};