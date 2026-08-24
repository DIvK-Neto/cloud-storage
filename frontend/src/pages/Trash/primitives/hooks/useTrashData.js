import { useState, useEffect, useCallback, useContext } from 'react';
import { message } from 'antd';
import { SettingsContext } from '../../../../context/SettingsContext';
import { getTrashList, restoreTrashItem, permanentDeleteTrashItem, clearTrash, getTrashCount } from '../../../../api/all_api';
import { useTask } from '../../../../context/TaskContext';
import { useUnfinishedAction } from '../../../../hooks/common/collections/actionPanel';

const sortItems = (a, b) => {
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
};

export const useTrashData = () => {
    const { dashboardPageSize } = useContext(SettingsContext);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [ordering, setOrdering] = useState('-deleted_at');
    const [selectedIds, setSelectedIds] = useState([]);
    const [trashCount, setTrashCount] = useState(0);
    const [itemType, setItemType] = useState('all');

    const [stats, setStats] = useState({
        total_folders: 0,
        total_files: 0,
        total_size: 0,
        files_by_type: {},
    });
    const [statsLoading, setStatsLoading] = useState(false);

    const { addTask, updateTask, completeTask } = useTask();
    const { setUnfinishedAction, clearUnfinishedAction, getUnfinishedAction } = useUnfinishedAction();

    const fetchTrashList = useCallback(async (page = currentPage, search = '', order = ordering, type = itemType) => {
        setLoading(true);
        setStatsLoading(true);
        setError(null);
        try {
            const response = await getTrashList({
                search: search || undefined,
                page: page,
                pageSize: dashboardPageSize === 0 ? 1000 : dashboardPageSize,
                ordering: order,
                type: type !== 'all' ? type : undefined,
            });
            const data = response.data;
            setItems(data.results || []);
            setTotalItems(data.count || 0);
            setCurrentPage(page);
            setOrdering(order);
            if (data.stats) {
                setStats(data.stats);
            }
        } catch (err) {
            const msg = err.response?.data?.detail || 'Ошибка загрузки корзины';
            setError(msg);
            message.error(msg);
        } finally {
            setLoading(false);
            setStatsLoading(false);
        }
    }, [currentPage, ordering, dashboardPageSize, itemType]);

    const fetchTrashCount = useCallback(async () => {
        try {
            const response = await getTrashCount();
            setTrashCount(response.data.total || 0);
        } catch (error) {
            console.error('Ошибка получения количества элементов в корзине:', error);
            setTrashCount(0);
        }
    }, []);

    const handlePageChange = useCallback((page) => {
        setCurrentPage(page);
        fetchTrashList(page, '', ordering, itemType);
    }, [fetchTrashList, ordering, itemType]);

    const handleOrderingChange = useCallback((order) => {
        setOrdering(order);
        setCurrentPage(1);
        fetchTrashList(1, '', order, itemType);
    }, [fetchTrashList, itemType]);

    const selectedCount = selectedIds.length;

    const handleToggleSelection = (key) => {
        setSelectedIds(prev => {
            const index = prev.indexOf(key);
            if (index === -1) {
                return [...prev, key];
            } else {
                return prev.filter(id => id !== key);
            }
        });
    };

    const handleSelectAll = (currentItems) => {
        const allKeys = currentItems.map(item => `${item.type}-${item.id}`);
        setSelectedIds(allKeys);
    };

    const handleClearSelection = () => {
        setSelectedIds([]);
    };

    const isAllSelected = (currentItems) => {
        if (currentItems.length === 0) return false;
        const allKeys = currentItems.map(item => `${item.type}-${item.id}`);
        return allKeys.every(key => selectedIds.includes(key));
    };

    const handleRestore = async (itemsToRestore) => {
        const taskId = `restore_${Date.now()}`;
        const total = itemsToRestore.length;

        addTask({
            id: taskId,
            type: 'restore',
            name: `Восстановление`,
            progress: 0,
            status: 'active',
            startedAt: new Date().toISOString(),
            details: {
                count: total,
                files: [],
            },
        });

        let successCount = 0;
        let errorCount = 0;
        const errors = [];
        const restoredItems = [];

        for (const item of itemsToRestore) {
            try {
                await restoreTrashItem(item.id, item.type);
                successCount++;
                restoredItems.push({
                    id: item.id,
                    name: item.name,
                    type: item.type,
                    status: 'success',
                });
            } catch (err) {
                const errorMsg = err.response?.data?.detail || err.message || 'Ошибка восстановления';
                errorCount++;
                errors.push(`${item.name}: ${errorMsg}`);
                restoredItems.push({
                    id: item.id,
                    name: item.name,
                    type: item.type,
                    status: 'error',
                    error: errorMsg,
                });
            }
            const progress = Math.round((successCount + errorCount) / total * 100);
            updateTask(taskId, { progress });
        }

        updateTask(taskId, {
            details: {
                count: total,
                files: restoredItems,
            }
        });

        if (errorCount === 0) {
            updateTask(taskId, { progress: 100, completedAt: new Date().toISOString() });
            completeTask(taskId, 'done');
            message.success(`Восстановлено ${successCount} элементов`);
        } else {
            const errorMsg = `Ошибки при восстановлении: ${errors.join('; ')}`;
            updateTask(taskId, { progress: 100, completedAt: new Date().toISOString() });
            completeTask(taskId, 'error', errorMsg);
            message.error(`Восстановлено ${successCount} из ${total}, ошибок: ${errorCount}`);
        }

        await fetchTrashList(currentPage, '', ordering, itemType);
        await fetchTrashCount();
        handleClearSelection();
    };

    const handlePermanentDelete = async (itemsToDelete) => {
        const taskId = `permanent_delete_${Date.now()}`;
        const total = itemsToDelete.length;

        addTask({
            id: taskId,
            type: 'delete_permanent',
            name: `Окончательное удаление`,
            progress: 0,
            status: 'active',
            startedAt: new Date().toISOString(),
            details: {
                count: total,
                files: [],
            },
        });

        let successCount = 0;
        let errorCount = 0;
        const errors = [];
        const deletedItems = [];

        for (const item of itemsToDelete) {
            try {
                await permanentDeleteTrashItem(item.id, item.type);
                successCount++;
                deletedItems.push({
                    id: item.id,
                    name: item.name,
                    type: item.type,
                    status: 'success',
                });
            } catch (err) {
                const errorMsg = err.response?.data?.detail || err.message || 'Ошибка удаления';
                errorCount++;
                errors.push(`${item.name}: ${errorMsg}`);
                deletedItems.push({
                    id: item.id,
                    name: item.name,
                    type: item.type,
                    status: 'error',
                    error: errorMsg,
                });
            }
            const progress = Math.round((successCount + errorCount) / total * 100);
            updateTask(taskId, { progress });
        }

        updateTask(taskId, {
            details: {
                count: total,
                files: deletedItems,
            }
        });

        if (errorCount === 0) {
            updateTask(taskId, { progress: 100, completedAt: new Date().toISOString() });
            completeTask(taskId, 'done');
            message.success(`Удалено окончательно ${successCount} элементов`);
        } else {
            const errorMsg = `Ошибки при удалении: ${errors.join('; ')}`;
            updateTask(taskId, { progress: 100, completedAt: new Date().toISOString() });
            completeTask(taskId, 'error', errorMsg);
            message.error(`Удалено ${successCount} из ${total}, ошибок: ${errorCount}`);
        }

        await fetchTrashList(currentPage, '', ordering, itemType);
        await fetchTrashCount();
        handleClearSelection();
    };

    const handleClearTrash = useCallback(async () => {
        const taskId = `clear_trash_${Date.now()}`;

        addTask({
            id: taskId,
            type: 'clear_trash',
            name: `Очистка корзины`,
            progress: 0,
            status: 'active',
            startedAt: new Date().toISOString(),
            details: {
                count: items.length,
                files: [],
            },
        });

        try {
            await clearTrash();
            updateTask(taskId, { progress: 100, completedAt: new Date().toISOString() });
            completeTask(taskId, 'done');
            message.success('Корзина очищена');
            await fetchTrashList(currentPage, '', ordering, itemType);
            await fetchTrashCount();
            handleClearSelection();
        } catch (err) {
            const errorMsg = err.response?.data?.detail || err.message || 'Ошибка очистки корзины';
            updateTask(taskId, { progress: 100, completedAt: new Date().toISOString() });
            completeTask(taskId, 'error', errorMsg);
            message.error(errorMsg);
        }
    }, [items.length, fetchTrashList, fetchTrashCount, clearTrash, addTask, updateTask, completeTask, currentPage, ordering, itemType]);

    const getSelectedItems = () => {
        return items.filter(item => selectedIds.includes(`${item.type}-${item.id}`));
    };

    const restoreSelected = useCallback(() => {
        const selected = getSelectedItems();
        if (selected.length > 0) {
            handleRestore(selected);
        }
    }, [handleRestore, getSelectedItems]);

    const permanentDeleteSelected = useCallback(() => {
        const selected = getSelectedItems();
        if (selected.length > 0) {
            handlePermanentDelete(selected);
        }
    }, [handlePermanentDelete, getSelectedItems]);

    const onManageLink = () => { };
    const onEditDescription = () => { };
    const onViewComments = () => { };

    return {
        items,
        loading,
        error,
        currentPage,
        totalItems,
        ordering,
        selectedIds,
        selectedCount,
        trashCount,
        itemType,
        setItemType,
        dashboardPageSize,
        stats,
        statsLoading,
        setStats,
        handlePageChange,
        handleOrderingChange,
        handleToggleSelection,
        handleSelectAll,
        handleClearSelection,
        isAllSelected,
        handleRestore,
        handlePermanentDelete,
        handleClearTrash,
        getSelectedItems,
        fetchTrashList,
        fetchTrashCount,
        setItems,
        restoreSelected,
        permanentDeleteSelected,
        onManageLink,
        onEditDescription,
        onViewComments,
        setSelectedIds,
    };
};