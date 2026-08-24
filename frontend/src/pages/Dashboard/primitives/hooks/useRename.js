import { useCallback } from 'react';
import { message } from 'antd';
import { renameFile } from '../../../../api/all_api';
import { renameFolder } from '../../../../api/all_api';

/**
 * Хук для переименования элемента (файла или папки).
 * @param {number|null} currentFolderId - ID текущей папки (не используется, оставлен для совместимости).
 * @param {Function} updateItem - Функция обновления элемента в локальном списке.
 * @param {Function} refreshStats - Функция обновления статистики (опционально).
 * @returns {Function} handleRenameItem.
 */
export const useRename = (currentFolderId, updateItem, refreshStats) => {
    const handleRenameItem = useCallback(
        async (item, newName) => {
            try {
                let updatedItem;
                if (item.type === 'folder') {
                    await renameFolder(item.id, newName);
                    updatedItem = { ...item, name: newName };
                } else {
                    await renameFile(item.id, newName);
                    updatedItem = { ...item, original_name: newName, name: newName };
                }
                message.success('Переименовано');
                // Обновляем локальный элемент
                updateItem(updatedItem);
                // Обновляем статистику, если функция передана
                if (refreshStats) {
                    await refreshStats();
                }
            } catch (err) {
                const msg = err.response?.data?.detail || 'Ошибка переименования';
                message.error(msg);
                throw err;
            }
        },
        [updateItem, refreshStats]
    );

    return { handleRenameItem };
};