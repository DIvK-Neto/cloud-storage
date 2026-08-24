import { useState } from 'react';
import { message } from 'antd';
import { useUnfinishedAction } from '../../../../hooks/common/collections/actionPanel';
import { useTask } from '../../../../context/TaskContext';
import { deleteFile, deleteFolder, permanentDeleteFile, permanentDeleteFolder, checkDeleteStatus } from '../../../../api/all_api';

export const useBulkDeleteModal = (
    fetchItems,
    currentFolderId,
    refreshStats,
    modalKeepOnClose = false,
    removeItem
) => {
    const [visible, setVisible] = useState(false);
    const [currentItems, setCurrentItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [resultStats, setResultStats] = useState(null);

    const [deleteMode, setDeleteMode] = useState('trash');
    const [statuses, setStatuses] = useState({});
    const [showOnlyProblems, setShowOnlyProblems] = useState(false);

    const { setUnfinishedAction, clearUnfinishedAction, getUnfinishedAction } = useUnfinishedAction();
    const { addTask, updateTask, completeTask } = useTask();

    const restoreSavedState = () => {
        const saved = getUnfinishedAction('delete');
        if (saved) {
            setDeleteMode(saved.deleteMode || 'trash');
            setStatuses(saved.statuses || {});
            setShowOnlyProblems(saved.showOnlyProblems || false);
            if (saved.currentItems && saved.currentItems.length > 0) {
                setCurrentItems(saved.currentItems);
            }
            return true;
        }
        return false;
    };

    const open = async (items) => {
        const restored = restoreSavedState();
        setIsComplete(false);
        setResultStats(null);

        let itemsToSet = items;
        if (restored && currentItems.length > 0) {
            itemsToSet = currentItems;
        } else {
            setCurrentItems(items);
        }

        setVisible(true);
        setLoading(true);

        try {
            const response = await checkDeleteStatus(itemsToSet.map(item => ({ id: item.id, type: item.type })));
            const newStatuses = {};
            response.data.items.forEach(item => {
                // Сохраняем полный объект статуса
                newStatuses[item.id] = {
                    status: item.status,
                    reason: item.reason || '',
                    hasLinks: item.hasLinks || false,
                    collections: item.collections || [],
                };
            });
            // Для элементов, которые не вернулись в ответе (на всякий случай)
            itemsToSet.forEach(item => {
                if (!newStatuses[item.id]) {
                    newStatuses[item.id] = {
                        status: 'success',
                        reason: 'Готов к удалению',
                        hasLinks: false,
                        collections: [],
                    };
                }
            });
            setStatuses(newStatuses);
        } catch (err) {
            console.error('Ошибка проверки статусов:', err);
            const fallback = {};
            itemsToSet.forEach(item => {
                fallback[item.id] = {
                    status: 'success',
                    reason: 'Готов к удалению',
                    hasLinks: false,
                    collections: [],
                };
            });
            setStatuses(fallback);
        } finally {
            setLoading(false);
        }
    };

    const close = () => {
        if (modalKeepOnClose && !isComplete) {
            const state = {
                currentItems,
                deleteMode,
                statuses,
                showOnlyProblems,
            };
            setUnfinishedAction('delete', state);
        } else {
            clearUnfinishedAction('delete');
        }
        setVisible(false);
        setCurrentItems([]);
        setStatuses({});
        setIsComplete(false);
        setResultStats(null);
    };

    const cancel = () => {
        clearUnfinishedAction('delete');
        setVisible(false);
        setCurrentItems([]);
        setStatuses({});
        setIsComplete(false);
        setResultStats(null);
    };

    const removeItemFromList = (item) => {
        const updatedItems = currentItems.filter(
            (el) => !(el.id === item.id && el.type === item.type)
        );
        setCurrentItems(updatedItems);
        const newStatuses = { ...statuses };
        delete newStatuses[item.id];
        setStatuses(newStatuses);

        if (updatedItems.length === 0) {
            if (!modalKeepOnClose) {
                close();
            } else {
                const state = {
                    currentItems: updatedItems,
                    deleteMode,
                    statuses: newStatuses,
                    showOnlyProblems,
                };
                setUnfinishedAction('delete', state);
            }
        }
    };

    const handleDelete = async () => {
        if (currentItems.length === 0) {
            message.warning('Нет элементов для удаления');
            return;
        }

        // Проверяем, есть ли хотя бы один готовый элемент (status === 'success' или 'warning')
        const hasReady = currentItems.some(item => {
            const st = statuses[item.id];
            return st && (st.status === 'success' || st.status === 'warning');
        });
        if (!hasReady) {
            message.warning('Нет элементов, готовых к удалению');
            return;
        }

        const taskId = `delete_${Date.now()}`;
        const totalItems = currentItems.length;

        addTask({
            id: taskId,
            type: 'delete',
            name: `Удаление`,
            progress: 0,
            status: 'active',
            startedAt: new Date().toISOString(),
            details: {
                count: totalItems,
                mode: deleteMode === 'trash' ? 'В корзину' : 'Окончательно',
                files: [],
            },
        });

        setLoading(true);

        try {
            let successCount = 0;
            let errorCount = 0;
            let skipCount = 0;
            const errors = [];
            const deletedItems = [];

            for (const item of currentItems) {
                const st = statuses[item.id];
                if (st && st.status === 'error') {
                    setStatuses(prev => ({ ...prev, [item.id]: { ...prev[item.id], status: 'skipped' } }));
                    skipCount++;
                    deletedItems.push({ id: item.id, name: item.name, status: 'skipped' });
                    const progress = Math.round((successCount + errorCount + skipCount) / totalItems * 100);
                    updateTask(taskId, { progress });
                    continue;
                }

                try {
                    if (deleteMode === 'trash') {
                        if (item.type === 'folder') {
                            await deleteFolder(item.id);
                        } else if (item.type === 'file') {
                            await deleteFile(item.id);
                        } else {
                            throw new Error('Неизвестный тип элемента');
                        }
                    } else {
                        if (item.type === 'folder') {
                            await permanentDeleteFolder(item.id);
                        } else if (item.type === 'file') {
                            await permanentDeleteFile(item.id);
                        } else {
                            throw new Error('Неизвестный тип элемента');
                        }
                    }

                    setStatuses(prev => ({ ...prev, [item.id]: { ...prev[item.id], status: 'success' } }));
                    successCount++;
                    deletedItems.push({ id: item.id, name: item.name, status: 'success' });

                    if (removeItem) {
                        removeItem(item.id, item.type);
                    }
                } catch (err) {
                    const errorMsg = err.response?.data?.detail || err.message || 'Ошибка удаления';
                    setStatuses(prev => ({ ...prev, [item.id]: { ...prev[item.id], status: 'error', reason: errorMsg } }));
                    errorCount++;
                    errors.push(`${item.name}: ${errorMsg}`);
                    deletedItems.push({
                        id: item.id,
                        name: item.name,
                        status: 'error',
                        error: errorMsg,
                    });
                }

                const progress = Math.round((successCount + errorCount + skipCount) / totalItems * 100);
                updateTask(taskId, { progress });
            }

            updateTask(taskId, {
                details: {
                    count: totalItems,
                    mode: deleteMode === 'trash' ? 'В корзину' : 'Окончательно',
                    files: deletedItems,
                }
            });

            clearUnfinishedAction('delete');

            if (fetchItems) {
                await fetchItems(currentFolderId);
            }
            if (refreshStats) {
                await refreshStats();
            }

            setResultStats({
                successCount,
                errorCount,
                skipCount,
                errors,
            });
            setIsComplete(true);

            if (errorCount === 0) {
                updateTask(taskId, { progress: 100, completedAt: new Date().toISOString() });
                completeTask(taskId, 'done');
                message.success(`Удалено ${successCount} элементов`);
            } else {
                const errorMsg = `Ошибки при удалении: ${errors.join('; ')}`;
                updateTask(taskId, { progress: 100, completedAt: new Date().toISOString() });
                completeTask(taskId, 'error', errorMsg);
                message.error(`Удалено ${successCount} из ${totalItems}, ошибок: ${errorCount}`);
            }

        } catch (error) {
            const errorMsg = error.message || 'Ошибка удаления';
            updateTask(taskId, { progress: 100, status: 'error', errorMessage: errorMsg, completedAt: new Date().toISOString() });
            completeTask(taskId, 'error', errorMsg);
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return {
        visible,
        currentItems,
        loading,
        statuses,
        deleteMode,
        setDeleteMode,
        showOnlyProblems,
        setShowOnlyProblems,
        isComplete,
        resultStats,
        open,
        close,
        cancel,
        removeItem: removeItemFromList,
        handleDelete,
    };
};