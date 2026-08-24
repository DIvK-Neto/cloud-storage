import { useState } from 'react';
import { message } from 'antd';
import { useUnfinishedAction } from '../../../../hooks/common/collections/actionPanel';
import { useTask } from '../../../../context/TaskContext';
import { moveFile, moveFolder, renameFile, renameFolder, listFiles, listFolders } from '../../../../api/all_api';

export const useBulkMoveModal = (
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

    const [targetFolderId, setTargetFolderId] = useState(null);
    const [conflictRule, setConflictRule] = useState('rename');
    const [prefix, setPrefix] = useState('Копия_');
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

    const getEffectiveRule = (item) => {
        const override = individualOverrides[item.id];
        if (override && override.rule) {
            return override.rule;
        }
        return conflictRule;
    };

    const restoreSavedState = () => {
        const saved = getUnfinishedAction('move');
        if (saved) {
            setTargetFolderId(saved.targetFolderId || null);
            setConflictRule(saved.conflictRule || 'rename');
            setPrefix(saved.prefix || 'Копия_');
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
            setTargetFolderId(null);
            setConflictRule('rename');
            setPrefix('Копия_');
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
                targetFolderId,
                conflictRule,
                prefix,
                suffix,
                applyToAll,
                individualOverrides,
                statuses,
                showOnlyProblems,
            };
            setUnfinishedAction('move', state);
        } else {
            clearUnfinishedAction('move');
        }
        setVisible(false);
        setCurrentItems([]);
        setStatuses({});
        setIndividualOverrides({});
        setIsComplete(false);
        setResultStats(null);
    };

    const cancel = () => {
        clearUnfinishedAction('move');
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
                    targetFolderId,
                    conflictRule,
                    prefix,
                    suffix,
                    applyToAll,
                    individualOverrides: newOverrides,
                    statuses: newStatuses,
                    showOnlyProblems,
                };
                setUnfinishedAction('move', state);
            }
        }
    };

    const updateItem = (item, newName, rule) => {
        setIndividualOverrides(prev => ({
            ...prev,
            [item.id]: {
                newName: newName || item.name,
                rule: rule || prev[item.id]?.rule || conflictRule,
            },
        }));
    };

    const handleMove = async () => {
        if (currentItems.length === 0) {
            message.warning('Нет элементов для перемещения');
            return;
        }

        if (targetFolderId === null || targetFolderId === undefined) {
            message.warning('Выберите папку назначения');
            return;
        }

        if (currentFolderId === null && targetFolderId === 0) {
            message.warning('Вы уже находитесь в корневой папке. Выберите другую папку.');
            return;
        }
        if (currentFolderId !== null && targetFolderId === currentFolderId) {
            message.warning('Вы уже находитесь в этой папке. Выберите другую папку.');
            return;
        }

        if (conflictRule === 'rename' && !prefix.trim() && !suffix.trim()) {
            message.warning('Укажите хотя бы одно поле: префикс или суффикс.');
            return;
        }

        const taskId = `move_${Date.now()}`;
        const totalItems = currentItems.length;

        addTask({
            id: taskId,
            type: 'move',
            name: `Перемещение`,
            progress: 0,
            status: 'active',
            startedAt: new Date().toISOString(),
            details: {
                count: totalItems,
                targetFolderId: targetFolderId,
                files: [],
            },
        });

        setLoading(true);

        try {
            let successCount = 0;
            let errorCount = 0;
            let skipCount = 0;
            const errors = [];
            const movedItems = [];

            const usedNames = new Set();

            for (const item of currentItems) {
                const effectiveRule = getEffectiveRule(item);

                if (effectiveRule === 'skip') {
                    setStatuses(prev => ({ ...prev, [item.id]: 'skipped' }));
                    skipCount++;
                    movedItems.push({ id: item.id, name: item.name, status: 'skipped' });
                    const progress = Math.round((successCount + errorCount + skipCount) / totalItems * 100);
                    updateTask(taskId, { progress });
                    continue;
                }

                try {
                    // Получаем актуальный список целевой папки
                    const folderId = targetFolderId === 0 ? null : targetFolderId;
                    const [filesRes, foldersRes] = await Promise.all([
                        listFiles(folderId),
                        listFolders(folderId),
                    ]);
                    const targetFiles = filesRes.data.map(f => f.name);
                    const targetFolders = foldersRes.data.map(f => f.name);
                    const targetNameSet = new Set([...targetFiles, ...targetFolders]);

                    // Проверяем конфликт для оригинального имени
                    const isConflict = targetNameSet.has(item.name) || usedNames.has(item.name);

                    let finalName = item.name;

                    if (effectiveRule === 'rename' && isConflict) {
                        // Если конфликт есть, применяем префикс/суффикс
                        let nameWithPrefixSuffix = buildNameWithPrefixSuffix(item.name, prefix, suffix);

                        // Проверяем, не занято ли уже это имя
                        if (targetNameSet.has(nameWithPrefixSuffix) || usedNames.has(nameWithPrefixSuffix)) {
                            // Генерируем уникальное имя с индексом
                            const lastDotIndex = nameWithPrefixSuffix.lastIndexOf('.');
                            let base, ext;
                            if (lastDotIndex > 0) {
                                base = nameWithPrefixSuffix.substring(0, lastDotIndex);
                                ext = nameWithPrefixSuffix.substring(lastDotIndex);
                            } else {
                                base = nameWithPrefixSuffix;
                                ext = '';
                            }
                            let newName = nameWithPrefixSuffix;
                            let counter = 1;
                            while (targetNameSet.has(newName) || usedNames.has(newName)) {
                                newName = `${base} (${counter})${ext}`;
                                counter++;
                            }
                            finalName = newName;
                            usedNames.add(finalName);
                        } else {
                            finalName = nameWithPrefixSuffix;
                            usedNames.add(finalName);
                        }

                        // Если имя изменилось, переименовываем
                        if (finalName !== item.name) {
                            if (item.type === 'folder') {
                                await renameFolder(item.id, finalName);
                            } else if (item.type === 'file') {
                                await renameFile(item.id, finalName);
                            } else {
                                throw new Error('Неизвестный тип элемента');
                            }
                            item.name = finalName;
                        }
                    } else if (effectiveRule === 'rename' && !isConflict) {
                        // Если конфликта нет, оставляем оригинальное имя
                        // Но добавляем его в usedNames, чтобы последующие элементы видели его как занятое
                        usedNames.add(item.name);
                        finalName = item.name;
                    } else {
                        // Если выбран режим 'replace' или что-то другое, просто добавляем имя в usedNames
                        usedNames.add(item.name);
                        finalName = item.name;
                    }

                    // Перемещаем элемент (с finalName, которое может быть изменено или нет)
                    const newFolderId = targetFolderId === 0 ? null : targetFolderId;
                    if (item.type === 'folder') {
                        await moveFolder(item.id, newFolderId);
                    } else if (item.type === 'file') {
                        await moveFile(item.id, newFolderId);
                    } else {
                        throw new Error('Неизвестный тип элемента');
                    }

                    setStatuses(prev => ({ ...prev, [item.id]: 'success' }));
                    successCount++;
                    movedItems.push({ id: item.id, name: finalName, status: 'success' });

                    if (removeItem) {
                        removeItem(item.id, item.type);
                    }
                } catch (err) {
                    const errorMsg = err.response?.data?.detail || err.message || 'Ошибка перемещения';
                    setStatuses(prev => ({ ...prev, [item.id]: 'error' }));
                    errorCount++;
                    errors.push(`${item.name}: ${errorMsg}`);
                    movedItems.push({ id: item.id, name: item.name, status: 'error', error: errorMsg });
                }

                const progress = Math.round((successCount + errorCount + skipCount) / totalItems * 100);
                updateTask(taskId, { progress });
            }

            updateTask(taskId, {
                details: {
                    count: totalItems,
                    targetFolderId: targetFolderId,
                    files: movedItems,
                }
            });

            clearUnfinishedAction('move');

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
                message.success(`Перемещено ${successCount} элементов`);
            } else {
                const errorMsg = `Ошибки при перемещении: ${errors.join('; ')}`;
                updateTask(taskId, { progress: 100, completedAt: new Date().toISOString() });
                completeTask(taskId, 'error', errorMsg);
                message.error(`Перемещено ${successCount} из ${totalItems}, ошибок: ${errorCount}`);
            }

        } catch (error) {
            const errorMsg = error.message || 'Ошибка перемещения';
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
        targetFolderId,
        setTargetFolderId,
        conflictRule,
        setConflictRule,
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
        updateItem,
        handleMove,
    };
};