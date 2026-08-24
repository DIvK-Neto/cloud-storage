import { useState } from 'react';
import { message } from 'antd';
import { useUnfinishedAction } from '../../../../hooks/common/collections/actionPanel';
import { useTask } from '../../../../context/TaskContext';
import api from '../../../../api/axios';

export const useDownloadModal = (
    fetchItems,
    currentFolderId,
    modalKeepOnClose = false
) => {
    const [visible, setVisible] = useState(false);
    const [currentItems, setCurrentItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [statuses, setStatuses] = useState({});

    const [formatType, setFormatType] = useState('individual');
    const [archiveName, setArchiveName] = useState('');
    const [archivePassword, setArchivePassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [saveFolder, setSaveFolder] = useState('');

    const { setUnfinishedAction, clearUnfinishedAction, getUnfinishedAction } = useUnfinishedAction();
    const { addTask, updateTask, completeTask } = useTask();

    const generateDefaultArchiveName = () => {
        const now = new Date();
        const date = now.toISOString().slice(0, 10);
        return `Archive_${date}`;
    };

    const restoreSavedState = () => {
        const saved = getUnfinishedAction('download');
        if (saved) {
            setFormatType(saved.formatType || 'individual');
            setArchiveName(saved.archiveName || generateDefaultArchiveName());
            setArchivePassword(saved.archivePassword || '');
            setShowPassword(saved.showPassword || false);
            setSaveFolder(saved.saveFolder || '');
            if (saved.currentItems && saved.currentItems.length > 0) {
                setCurrentItems(saved.currentItems);
                const initialStatuses = {};
                saved.currentItems.forEach(item => {
                    initialStatuses[item.id] = 'pending';
                });
                setStatuses(initialStatuses);
            }
            return true;
        }
        return false;
    };

    const open = (items) => {
        const restored = restoreSavedState();
        if (!restored) {
            setCurrentItems(items);
            setFormatType('individual');
            setArchiveName(generateDefaultArchiveName());
            setArchivePassword('');
            setShowPassword(false);
            setSaveFolder('');
            const initialStatuses = {};
            items.forEach(item => {
                initialStatuses[item.id] = 'pending';
            });
            setStatuses(initialStatuses);
        } else {
            if (items && items.length > 0) {
                setCurrentItems(items);
                const initialStatuses = {};
                items.forEach(item => {
                    initialStatuses[item.id] = 'pending';
                });
                setStatuses(initialStatuses);
            }
        }
        setVisible(true);
        setLoading(false);
    };

    const close = () => {
        if (modalKeepOnClose) {
            const state = {
                formatType,
                archiveName,
                archivePassword,
                showPassword,
                saveFolder,
                currentItems,
            };
            setUnfinishedAction('download', state);
        }
        setVisible(false);
        setCurrentItems([]);
        setStatuses({});
    };

    const cancel = () => {
        clearUnfinishedAction('download');
        setVisible(false);
        setCurrentItems([]);
        setStatuses({});
    };

    const removeItem = (item) => {
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
                    formatType,
                    archiveName,
                    archivePassword,
                    showPassword,
                    saveFolder,
                    currentItems: updatedItems,
                };
                setUnfinishedAction('download', state);
            }
        }
    };

    const renameItem = (item, newName) => {
        setCurrentItems(prev =>
            prev.map(el =>
                el.id === item.id && el.type === item.type
                    ? { ...el, name: newName }
                    : el
            )
        );
    };

    const downloadSingleItem = async (item, taskId) => {
        try {
            let url;
            if (item.type === 'file') {
                url = `/files/${item.id}/download/`;
            } else if (item.type === 'folder') {
                url = `/folders/${item.id}/download-folder/`;
            } else {
                throw new Error('Неизвестный тип элемента');
            }

            const response = await api.get(url, {
                responseType: 'blob',
            });

            const contentType = response.headers['content-type'] || '';
            if (contentType.includes('application/json')) {
                const text = await response.data.text();
                const json = JSON.parse(text);
                message.error(json.error || 'Ошибка скачивания');
                setStatuses(prev => ({ ...prev, [item.id]: 'error' }));
                return { success: false, id: item.id, name: item.name, type: item.type, error: json.error || 'Ошибка скачивания' };
            }

            const blob = new Blob([response.data]);
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            const fileName = item.type === 'folder' ? `${item.name}.zip` : item.name;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);

            setStatuses(prev => ({ ...prev, [item.id]: 'success' }));
            return { success: true, id: item.id, name: item.name, type: item.type };
        } catch (error) {
            const msg = error.message || 'Ошибка скачивания';
            setStatuses(prev => ({ ...prev, [item.id]: 'error' }));
            return { success: false, id: item.id, name: item.name, type: item.type, error: msg };
        }
    };

    const downloadZip = async (items, taskId) => {
        try {
            const ids = items.map(item => item.id);
            const params = new URLSearchParams();
            params.append('items', ids.join(','));
            if (archiveName) params.append('name', archiveName);
            if (showPassword && archivePassword) params.append('password', archivePassword);
            const url = `/download/bulk/?${params.toString()}`;

            const response = await api.get(url, {
                responseType: 'blob',
            });

            const contentType = response.headers['content-type'] || '';
            if (contentType.includes('application/json')) {
                const text = await response.data.text();
                const json = JSON.parse(text);
                message.error(json.error || 'Ошибка создания архива');
                return { success: false, id: 'bulk', name: archiveName || generateDefaultArchiveName(), type: 'zip', error: json.error || 'Ошибка' };
            }

            const blob = new Blob([response.data]);
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            const fileName = `${archiveName || generateDefaultArchiveName()}.zip`;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);

            return { success: true, id: 'bulk', name: archiveName || generateDefaultArchiveName(), type: 'zip' };
        } catch (error) {
            const msg = error.message || 'Ошибка создания архива';
            return { success: false, id: 'bulk', name: archiveName || generateDefaultArchiveName(), type: 'zip', error: msg };
        }
    };

    const handleDownload = async () => {
        if (currentItems.length === 0) {
            message.warning('Нет элементов для скачивания');
            return;
        }

        const taskId = `download_${Date.now()}`;
        const totalItems = currentItems.length;
        const downloadedFiles = [];

        addTask({
            id: taskId,
            type: 'download',
            name: `Скачивание`,
            progress: 0,
            status: 'active',
            startedAt: new Date().toISOString(),
            details: {
                count: totalItems,
                format: formatType === 'individual' ? 'Отдельные файлы' : 'ZIP-архив',
                files: [],
            },
        });

        setLoading(true);

        try {
            if (formatType === 'individual') {
                let successCount = 0;
                let errorCount = 0;
                const errors = [];

                for (const item of currentItems) {
                    const result = await downloadSingleItem(item, taskId);
                    if (result.success) {
                        successCount++;
                        downloadedFiles.push({ id: result.id, name: result.name, type: result.type, status: 'success' });
                    } else {
                        errorCount++;
                        errors.push(result.name);
                        downloadedFiles.push({ id: result.id, name: result.name, type: result.type, status: 'error', error: result.error });
                    }
                    const progress = Math.round((successCount + errorCount) / totalItems * 100);
                    updateTask(taskId, { progress });
                }

                updateTask(taskId, {
                    details: {
                        count: totalItems,
                        format: 'Отдельные файлы',
                        files: downloadedFiles,
                    }
                });

                if (errorCount === 0) {
                    updateTask(taskId, { progress: 100, completedAt: new Date().toISOString() });
                    completeTask(taskId, 'done');
                    message.success(`Скачано ${successCount} элементов`);
                } else {
                    const errorMsg = `Ошибка при скачивании: ${errors.join(', ')}`;
                    updateTask(taskId, { progress: 100, completedAt: new Date().toISOString() });
                    completeTask(taskId, 'error', errorMsg);
                    message.error(`Скачано ${successCount} из ${totalItems}, ошибок: ${errorCount}`);
                }
            } else if (formatType === 'zip') {
                const result = await downloadZip(currentItems, taskId);
                if (result.success) {
                    // Обновляем статусы всех элементов на success
                    const newStatuses = {};
                    currentItems.forEach(item => {
                        newStatuses[item.id] = 'success';
                    });
                    setStatuses(newStatuses);

                    downloadedFiles.push({ id: result.id, name: result.name, type: result.type, status: 'success' });

                    // Сохраняем параметры архива для повторного скачивания в виджете
                    const zipParams = {
                        ids: currentItems.map(item => item.id),
                        name: archiveName || generateDefaultArchiveName(),
                        password: showPassword ? archivePassword : null,
                    };
                    updateTask(taskId, {
                        details: {
                            count: totalItems,
                            format: 'ZIP-архив',
                            files: downloadedFiles,
                            zipParams: zipParams,
                        }
                    });
                    updateTask(taskId, { progress: 100, completedAt: new Date().toISOString() });
                    completeTask(taskId, 'done');
                    message.success('Архив скачан');
                } else {
                    // Обновляем статусы всех элементов на error
                    const newStatuses = {};
                    currentItems.forEach(item => {
                        newStatuses[item.id] = 'error';
                    });
                    setStatuses(newStatuses);

                    downloadedFiles.push({ id: result.id, name: result.name, type: result.type, status: 'error', error: result.error });
                    updateTask(taskId, {
                        details: {
                            count: totalItems,
                            format: 'ZIP-архив',
                            files: downloadedFiles,
                        }
                    });
                    updateTask(taskId, { progress: 100, completedAt: new Date().toISOString() });
                    completeTask(taskId, 'error', result.error);
                    message.error(result.error || 'Ошибка создания архива');
                }
            }

            clearUnfinishedAction('download');
        } catch (error) {
            const errorMsg = error.message || 'Ошибка скачивания';
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
        formatType,
        setFormatType,
        archiveName,
        setArchiveName,
        archivePassword,
        setArchivePassword,
        showPassword,
        setShowPassword,
        saveFolder,
        setSaveFolder,
        open,
        close,
        cancel,
        removeItem,
        renameItem,
        handleDownload,
    };
};