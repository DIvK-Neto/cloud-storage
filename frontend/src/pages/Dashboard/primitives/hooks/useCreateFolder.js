import { useCallback } from 'react';
import { message } from 'antd';
import { createFolder } from '../../../../api/folders/collections/folders';

export const useCreateFolder = (addItem, refreshStats, fetchItems) => {
    const handleCreateFolder = useCallback(
        async (name, folderId) => {
            try {
                const res = await createFolder(name, folderId);
                message.success('Папка создана');
                // Если есть валидный id, добавляем локально
                if (res.data && res.data.id) {
                    const newFolder = {
                        ...res.data,
                        type: 'folder',
                        name: res.data.name,
                        size: 0,
                        date: res.data.created_at,
                    };
                    if (addItem) addItem(newFolder);
                } else {
                    // Если данных нет, делаем полную перезагрузку
                    console.warn('useCreateFolder: некорректный ответ сервера', res);
                    if (fetchItems) await fetchItems(folderId);
                }
                if (refreshStats) await refreshStats();
            } catch (err) {
                const msg = err.response?.data?.detail || 'Ошибка создания папки';
                message.error(msg);
                throw err;
            }
        },
        [addItem, refreshStats, fetchItems]
    );

    return { handleCreateFolder };
};