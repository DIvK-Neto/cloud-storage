import { useState, useEffect, useCallback, useRef } from 'react';
import { getFolderStats, getStorageStats } from '../../../../api/all_api';

export const useStats = (currentFolderId) => {
    const [stats, setStats] = useState({
        folders_count: 0,
        files_count: 0,
        total_size: 0,
        files_by_type: {
            images: 0,
            documents: 0,
            videos: 0,
            audio: 0,
            archives: 0,
            other: 0,
        },
    });
    const [loading, setLoading] = useState(false);
    const lastLoadedFolderIdRef = useRef(null);
    const isFirstLoadRef = useRef(true);

    const loadStats = useCallback(async () => {
        // Если папка не изменилась и мы уже загружали статистику, пропускаем
        if (!isFirstLoadRef.current && lastLoadedFolderIdRef.current === currentFolderId) {
            return;
        }
        lastLoadedFolderIdRef.current = currentFolderId;
        isFirstLoadRef.current = false;
        setLoading(true);
        try {
            let response;
            if (currentFolderId === null) {
                response = await getStorageStats();
            } else {
                response = await getFolderStats(currentFolderId);
            }
            setStats(response.data);
        } catch (error) {
            console.error('Ошибка загрузки статистики:', error);
        } finally {
            setLoading(false);
        }
    }, [currentFolderId]);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    const refreshStats = useCallback(() => {
        // Принудительное обновление — сбрасываем кэш
        lastLoadedFolderIdRef.current = null;
        isFirstLoadRef.current = true;
        loadStats();
    }, [loadStats]);

    return {
        stats,
        loading,
        refreshStats,
    };
};