import { useState } from 'react';
import { message } from 'antd';
import { useUnfinishedAction } from '../../../../hooks/common/collections/actionPanel';
import { useTask } from '../../../../context/TaskContext';
import { renameFile, renameFolder, listFiles, listFolders } from '../../../../api/all_api';

export const useBulkRenameModal = (
    fetchItems,
    currentFolderId,
    refreshStats,
    modalKeepOnClose = false,
    updateItem,
    addItem,
    removeItem
) => {
    const [visible, setVisible] = useState(false);
    const [currentItems, setCurrentItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [resultStats, setResultStats] = useState(null);

    const [prefix, setPrefix] = useState('');
    const [suffix, setSuffix] = useState('');
    const [applyToAll, setApplyToAll] = useState(true);

    const [individualOverrides, setIndividualOverrides] = useState({});
    const [statuses, setStatuses] = useState({});
    const [showOnlyProblems, setShowOnlyProblems] = useState(false);

    const { setUnfinishedAction, clearUnfinishedAction, getUnfinishedAction } = useUnfinishedAction();
    const { addTask, updateTask, completeTask } = useTask();

    const buildNameWithPrefixSuffix = (originalName, prefixVal, suffixVal) => {
        let newName = originalName;
        if (prefixVal && !newName.startsWith(prefixVal)) {
            newName = prefixVal + newName;
        }
        if (suffixVal) {
            const lastDotIndex = newName.lastIndexOf('.');
            if (lastDotIndex > 0) {
                const base = newName.substring(0, lastDotIndex);
                const ext = newName.substring(lastDotIndex);
                newName = base + suffixVal + ext;
            } else {
                newName = newName + suffixVal;
            }
        }
        return newName;
    };

    const getEffectiveName = (item) => {
        const override = individualOverrides[item.id];
        if (override && override.newName !== undefined) {
            return override.newName;
        }
        if (applyToAll) {
            return buildNameWithPrefixSuffix(item.name, prefix, suffix);
        }
        return item.name;
    };

    const restoreSavedState = () => {
        const saved = getUnfinishedAction('rename');
        if (saved) {
            setPrefix(saved.prefix || '');
            setSuffix(saved.suffix || '');
            setApplyToAll(saved.applyToAll !== undefined ? saved.applyToAll : true);
            setIndividualOverrides(saved.individualOverrides || {});
            setStatuses(saved.statuses || {});
            setShowOnlyProblems(saved.showOnlyProblems || false);
            if (saved.currentItems && saved.currentItems.length > 0) {
                setCurrentItems(saved.currentItems);
            }
            return true;
        }
        return false;
    };

    const open = (items) => {
        const restored = restoreSavedState();
        setIsComplete(false);
        setResultStats(null);

        if (!restored) {
            setCurrentItems(items);
            setPrefix('');
            setSuffix('');
            setApplyToAll(true);
            setIndividualOverrides({});
            const initialStatuses = {};
            items.forEach(item => {
                initialStatuses[item.id] = 'pending';
            });
            setStatuses(initialStatuses);
            setShowOnlyProblems(false);
        } else {
            if (items && items.length > 0) {
                setCurrentItems(items);
                const newStatuses = { ...statuses };
                items.forEach(item => {
                    if (!newStatuses[item.id]) {
                        newStatuses[item.id] = 'pending';
                    }
                });
                setStatuses(newStatuses);
            }
        }
        setVisible(true);
        setLoading(false);
    };

    const close = () => {
        if (modalKeepOnClose && !isComplete) {
            const state = {
                currentItems,
                prefix,
                suffix,
                applyToAll,
                individualOverrides,
                statuses,
                showOnlyProblems,
            };
            setUnfinishedAction('rename', state);
        } else {
            clearUnfinishedAction('rename');
        }
        setVisible(false);
        setCurrentItems([]);
        setStatuses({});
        setIndividualOverrides({});
        setIsComplete(false);
        setResultStats(null);
    };

    const cancel = () => {
        clearUnfinishedAction('rename');
        setVisible(false);
        setCurrentItems([]);
        setStatuses({});
        setIndividualOverrides({});
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
        const newOverrides = { ...individualOverrides };
        delete newOverrides[item.id];
        setIndividualOverrides(newOverrides);

        if (updatedItems.length === 0) {
            if (!modalKeepOnClose) {
                close();
            } else {
                const state = {
                    currentItems: updatedItems,
                    prefix,
                    suffix,
                    applyToAll,
                    individualOverrides: newOverrides,
                    statuses: newStatuses,
                    showOnlyProblems,
                };
                setUnfinishedAction('rename', state);
            }
        }
    };

    const updateItemName = (item, newName) => {
        setIndividualOverrides(prev => ({
            ...prev,
            [item.id]: {
                newName: newName || item.name,
            },
        }));
    };

    const checkConflicts = (items, effectiveNames) => {
        const nameSet = new Set();
        const conflicts = {};
        items.forEach(item => {
            const name = effectiveNames[item.id] || item.name;
            if (nameSet.has(name)) {
                conflicts[item.id] = true;
            }
            nameSet.add(name);
        });
        return conflicts;
    };

    const handleRename = async () => {
        if (currentItems.length === 0) {
            message.warning('Нет элементов для переименования');
            return;
        }

        let hasChanges = false;
        const effectiveNames = {};
        currentItems.forEach(item => {
            const newName = getEffectiveName(item);
            effectiveNames[item.id] = newName;
            if (newName !== item.name) {
                hasChanges = true;
            }
        });

        if (!hasChanges) {
            message.warning('Нет изменений для переименования');
            return;
        }

        const internalConflicts = checkConflicts(currentItems, effectiveNames);
        if (Object.keys(internalConflicts).length > 0) {
            message.warning('Обнаружены конфликты имён между элементами. Отредактируйте имена вручную.');
            return;
        }

        let existingNames = new Set();
        try {
            const [filesRes, foldersRes] = await Promise.all([
                listFiles(currentFolderId),
                listFolders(currentFolderId),
            ]);
            const files = filesRes.data.map(f => f.name);
            const folders = foldersRes.data.map(f => f.name);
            existingNames = new Set([...files, ...folders]);
        } catch (err) {
            console.warn('Не удалось получить список текущей папки, проверка конфликтов будет пропущена', err);
        }

        const finalNames = {};
        const usedNames = new Set();
        for (const item of currentItems) {
            let newName = effectiveNames[item.id];
            if (newName === item.name) {
                finalNames[item.id] = newName;
                usedNames.add(newName);
                continue;
            }
            if (existingNames.has(newName) && newName !== item.name) {
                const lastDotIndex = newName.lastIndexOf('.');
                let base, ext;
                if (lastDotIndex > 0) {
                    base = newName.substring(0, lastDotIndex);
                    ext = newName.substring(lastDotIndex);
                } else {
                    base = newName;
                    ext = '';
                }
                let candidate = newName;
                let counter = 1;
                while (existingNames.has(candidate) || usedNames.has(candidate)) {
                    candidate = `${base} (${counter})${ext}`;
                    counter++;
                }
                setIndividualOverrides(prev => ({
                    ...prev,
                    [item.id]: { newName: candidate },
                }));
                finalNames[item.id] = candidate;
                usedNames.add(candidate);
                existingNames.add(candidate);
            } else {
                finalNames[item.id] = newName;
                usedNames.add(newName);
                existingNames.add(newName);
            }
        }

        const conflictItems = currentItems.filter(item => finalNames[item.id] === item.name && effectiveNames[item.id] !== item.name);
        if (conflictItems.length > 0) {
            message.warning('Не удалось автоматически разрешить конфликты имён. Отредактируйте имена вручную.');
            const newStatuses = { ...statuses };
            conflictItems.forEach(item => {
                newStatuses[item.id] = 'warning';
            });
            setStatuses(newStatuses);
            return;
        }

        const taskId = `rename_${Date.now()}`;
        const totalItems = currentItems.length;

        addTask({
            id: taskId,
            type: 'rename',
            name: `Переименование`,
            progress: 0,
            status: 'active',
            startedAt: new Date().toISOString(),
            details: {
                count: totalItems,
                files: [],
            },
        });

        setLoading(true);

        try {
            let successCount = 0;
            let errorCount = 0;
            const errors = [];
            const renamedItems = [];

            for (const item of currentItems) {
                const newName = finalNames[item.id];
                if (newName === item.name) {
                    setStatuses(prev => ({ ...prev, [item.id]: 'skipped' }));
                    renamedItems.push({
                        id: item.id,
                        oldName: item.name,
                        newName: newName,
                        status: 'skipped',
                        folderId: item.folder || currentFolderId,
                    });
                    const progress = Math.round((successCount + errorCount) / totalItems * 100);
                    updateTask(taskId, { progress });
                    continue;
                }

                try {
                    if (item.type === 'folder') {
                        await renameFolder(item.id, newName);
                    } else if (item.type === 'file') {
                        await renameFile(item.id, newName);
                    } else {
                        throw new Error('Неизвестный тип элемента');
                    }

                    setStatuses(prev => ({ ...prev, [item.id]: 'success' }));
                    successCount++;
                    renamedItems.push({
                        id: item.id,
                        oldName: item.name,
                        newName: newName,
                        status: 'success',
                        folderId: item.folder || currentFolderId,
                    });

                    if (updateItem) {
                        const updatedItem = { ...item, name: newName };
                        if (item.type === 'file') {
                            updatedItem.original_name = newName;
                        }
                        updateItem(updatedItem);
                    }
                } catch (err) {
                    const errorMsg = err.response?.data?.detail || err.message || 'Ошибка переименования';
                    setStatuses(prev => ({ ...prev, [item.id]: 'error' }));
                    errorCount++;
                    errors.push(`${item.name}: ${errorMsg}`);
                    renamedItems.push({
                        id: item.id,
                        oldName: item.name,
                        newName: newName,
                        status: 'error',
                        error: errorMsg,
                        folderId: item.folder || currentFolderId,
                    });
                }

                const progress = Math.round((successCount + errorCount) / totalItems * 100);
                updateTask(taskId, { progress });
            }

            updateTask(taskId, {
                details: {
                    count: totalItems,
                    files: renamedItems,
                }
            });

            clearUnfinishedAction('rename');

            if (fetchItems) {
                await fetchItems(currentFolderId);
            }
            if (refreshStats) {
                await refreshStats();
            }

            setResultStats({
                successCount,
                errorCount,
                errors,
            });
            setIsComplete(true);

            if (errorCount === 0) {
                updateTask(taskId, { progress: 100, completedAt: new Date().toISOString() });
                completeTask(taskId, 'done');
                message.success(`Переименовано ${successCount} элементов`);
            } else {
                const errorMsg = `Ошибки при переименовании: ${errors.join('; ')}`;
                updateTask(taskId, { progress: 100, completedAt: new Date().toISOString() });
                completeTask(taskId, 'error', errorMsg);
                message.error(`Переименовано ${successCount} из ${totalItems}, ошибок: ${errorCount}`);
            }

        } catch (error) {
            const errorMsg = error.message || 'Ошибка переименования';
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
        prefix,
        setPrefix,
        suffix,
        setSuffix,
        applyToAll,
        setApplyToAll,
        individualOverrides,
        showOnlyProblems,
        setShowOnlyProblems,
        isComplete,
        resultStats,
        open,
        close,
        cancel,
        removeItem: removeItemFromList,
        updateItem: updateItemName,
        handleRename,
    };
};