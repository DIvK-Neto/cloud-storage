import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { listFiles, listFolders, getFolderPath } from '../../../../api/all_api';
import { normalizeItem } from '../../../../utils/common/primitives/normalizeItem';

// Функция сравнения для сортировки: папки сверху, внутри по имени (естественный порядок)
const sortItems = (a, b) => {
    // Сначала папки
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;
    // Оба одного типа — сортируем по имени (естественно, регистронезависимо)
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
};

export const useNavigation = () => {
    const [items, setItems] = useState([]);
    const [currentFolderId, setCurrentFolderId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [path, setPath] = useState([]);

    const normalizeAndKeepAll = (item, type) => {
        const normalized = normalizeItem(item);
        return {
            ...item,
            ...normalized,
            type,
        };
    };

    const fetchItems = useCallback(async (folderIdArg = null) => {
        // Защита от передачи объекта вместо ID
        const folderId = (typeof folderIdArg === 'object' && folderIdArg !== null)
            ? folderIdArg.id
            : folderIdArg;

        setLoading(true);
        setError(null);
        try {
            const [filesRes, foldersRes] = await Promise.all([
                listFiles(folderId),
                listFolders(folderId),
            ]);
            const files = filesRes.data.map(f => normalizeAndKeepAll(f, 'file'));
            const folders = foldersRes.data.map(f => normalizeAndKeepAll(f, 'folder'));
            // Сортировка при загрузке
            const sorted = [...folders, ...files].sort(sortItems);
            setItems(sorted);
            setCurrentFolderId(folderId);
        } catch (err) {
            const msg = err.response?.data?.detail || 'Ошибка загрузки списка';
            setError(msg);
            message.error(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchPath = useCallback(async (folderId) => {
        if (!folderId) {
            setPath([]);
            return;
        }
        try {
            const res = await getFolderPath(folderId);
            setPath(res.data);
        } catch (err) {
            console.warn('Не удалось получить путь для папки:', folderId, err);
            setPath([]);
        }
    }, []);

    const navigateToFolder = useCallback(
        async (folderId) => {
            await fetchItems(folderId);
            if (folderId) {
                await fetchPath(folderId);
            } else {
                setPath([]);
            }
        },
        [fetchItems, fetchPath]
    );

    const goToRoot = useCallback(() => {
        navigateToFolder(null);
    }, [navigateToFolder]);

    useEffect(() => {
        fetchItems(null);
    }, [fetchItems]);

    return {
        items,
        currentFolderId,
        loading,
        error,
        path,
        fetchItems,
        navigateToFolder,
        goToRoot,
        fetchPath,
        setItems,
    };
};