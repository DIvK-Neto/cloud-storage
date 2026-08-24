import { useState } from 'react';
import { Modal, message } from 'antd';
import { useUnfinishedAction } from '../../../../hooks/common/collections/actionPanel';
import { useTask } from '../../../../context/TaskContext';

export const useShareModal = (onCreateLinks, fetchItems, currentFolderId, modalKeepOnClose = false) => {
    const [visible, setVisible] = useState(false);
    const [currentItems, setCurrentItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [generatedLinks, setGeneratedLinks] = useState([]);

    // Настройки (полный набор для LinkSettings)
    const [linkType, setLinkType] = useState('individual');
    const [expirationType, setExpirationType] = useState('7days');
    const [customDays, setCustomDays] = useState('');
    const [expirationDate, setExpirationDate] = useState(null);
    const [timeType, setTimeType] = useState('none');
    const [customTime, setCustomTime] = useState('');
    const [allowDownload, setAllowDownload] = useState(true);
    const [passwordViewEnabled, setPasswordViewEnabled] = useState(false);
    const [passwordDownloadEnabled, setPasswordDownloadEnabled] = useState(false);
    const [passwordView, setPasswordView] = useState('');
    const [passwordDownload, setPasswordDownload] = useState('');

    const { setUnfinishedAction, clearUnfinishedAction, getUnfinishedAction } = useUnfinishedAction();
    const { addTask, updateTask, completeTask } = useTask();

    // Восстановление сохранённых настроек
    const restoreSavedState = () => {
        const saved = getUnfinishedAction('share');
        if (saved) {
            setLinkType(saved.linkType || 'individual');
            setExpirationType(saved.expirationType || '7days');
            setCustomDays(saved.customDays || '');
            setExpirationDate(saved.expirationDate || null);
            setTimeType(saved.timeType || 'none');
            setCustomTime(saved.customTime || '');
            setAllowDownload(saved.allowDownload !== undefined ? saved.allowDownload : true);
            setPasswordViewEnabled(saved.passwordViewEnabled || false);
            setPasswordDownloadEnabled(saved.passwordDownloadEnabled || false);
            setPasswordView(saved.passwordView || '');
            setPasswordDownload(saved.passwordDownload || '');
            if (saved.currentItems && saved.currentItems.length > 0) {
                setCurrentItems(saved.currentItems);
            }
            return true;
        }
        return false;
    };

    const open = (items) => {
        const restored = restoreSavedState();

        if (!restored) {
            setCurrentItems(items);
            setLinkType('individual');
            setExpirationType('7days');
            setCustomDays('');
            setExpirationDate(null);
            setTimeType('none');
            setCustomTime('');
            setAllowDownload(true);
            setPasswordViewEnabled(false);
            setPasswordDownloadEnabled(false);
            setPasswordView('');
            setPasswordDownload('');
        } else {
            if (items && items.length > 0) {
                setCurrentItems(items);
            }
        }

        setVisible(true);
        setGeneratedLinks([]);
        setLoading(false);
    };

    const close = () => {
        if (modalKeepOnClose) {
            const state = {
                linkType,
                expirationType,
                customDays,
                expirationDate,
                timeType,
                customTime,
                allowDownload,
                passwordViewEnabled,
                passwordDownloadEnabled,
                passwordView,
                passwordDownload,
                currentItems,
            };
            setUnfinishedAction('share', state);
        }
        setVisible(false);
        setCurrentItems([]);
        setGeneratedLinks([]);
    };

    const cancel = () => {
        clearUnfinishedAction('share');
        setVisible(false);
        setCurrentItems([]);
        setGeneratedLinks([]);
    };

    const removeItem = (item) => {
        Modal.confirm({
            title: 'Удалить элемент из списка',
            content: `Вы уверены, что хотите удалить "${item.name}" из списка для создания ссылки?`,
            okText: 'Удалить',
            cancelText: 'Отмена',
            onOk: () => {
                const updatedItems = currentItems.filter(
                    (el) => !(el.id === item.id && el.type === item.type)
                );
                setCurrentItems(updatedItems);

                if (updatedItems.length === 0) {
                    if (!modalKeepOnClose) {
                        close();
                    } else {
                        const state = {
                            linkType,
                            expirationType,
                            customDays,
                            expirationDate,
                            timeType,
                            customTime,
                            allowDownload,
                            passwordViewEnabled,
                            passwordDownloadEnabled,
                            passwordView,
                            passwordDownload,
                            currentItems: updatedItems,
                        };
                        setUnfinishedAction('share', state);
                    }
                }
            },
        });
    };

    const handleCreateLinks = async () => {
        const taskId = `share_${Date.now()}`;
        addTask({
            id: taskId,
            type: 'share',
            name: `Создание ссылок`,
            progress: 0,
            status: 'active',
            startedAt: new Date().toISOString(),
            details: {
                linkType: linkType === 'individual' ? 'Отдельные ссылки' : 'Общая ссылка',
                count: currentItems.length,
            },
        });

        setLoading(true);
        try {
            updateTask(taskId, { progress: 50 });

            // --- УПРОЩЁННАЯ ЛОГИКА ВЫЧИСЛЕНИЯ expiresAt ---
            let expiresAt = null;
            let baseDate = new Date();

            // 1. Если выбран срок в днях
            if (expirationType === '1day' || expirationType === '3days' || expirationType === '7days' || expirationType === 'custom') {
                let days = 0;
                if (expirationType === '1day') days = 1;
                else if (expirationType === '3days') days = 3;
                else if (expirationType === '7days') days = 7;
                else if (expirationType === 'custom') {
                    const d = parseInt(customDays, 10);
                    if (isNaN(d) || d <= 0) {
                        message.error('Введите корректное количество дней');
                        setLoading(false);
                        return;
                    }
                    days = d;
                }
                baseDate.setDate(baseDate.getDate() + days);
            }
            // 2. Если выбрана конкретная дата
            else if (expirationType === 'date' && expirationDate) {
                baseDate = new Date(expirationDate);
                baseDate.setHours(0, 0, 0, 0);
            }
            // 3. Если выбрано "Всегда" или ничего не выбрано
            else if (expirationType === 'always' || expirationType === null) {
                // Если при этом выбрано время, то срок = текущая дата + время
                // Иначе бессрочно
                if (timeType !== 'none') {
                    baseDate = new Date(); // текущая дата и время
                } else {
                    expiresAt = null;
                }
            }

            // 4. Добавляем время (если оно выбрано и не бессрочно)
            if (expirationType !== 'always') {
                let hours = 0, minutes = 0;
                if (timeType === '1hour') hours = 1;
                else if (timeType === '4hours') hours = 4;
                else if (timeType === '12hours') hours = 12;
                else if (timeType === 'custom') {
                    const parts = customTime.split(':');
                    if (parts.length === 2) {
                        const h = parseInt(parts[0], 10);
                        const m = parseInt(parts[1], 10);
                        if (!isNaN(h) && !isNaN(m) && h >= 0 && m >= 0) {
                            hours = h;
                            minutes = m;
                        } else {
                            message.error('Неверный формат времени, используйте чч:мм');
                            setLoading(false);
                            return;
                        }
                    } else {
                        message.error('Неверный формат времени, используйте чч:мм');
                        setLoading(false);
                        return;
                    }
                }

                // Если есть время, добавляем к baseDate
                if (hours > 0 || minutes > 0) {
                    baseDate.setHours(baseDate.getHours() + hours);
                    baseDate.setMinutes(baseDate.getMinutes() + minutes);
                    expiresAt = baseDate.toISOString();
                } else {
                    // Время не выбрано, но есть дата — ставим конец дня 23:59:59
                    if (expirationType === 'date' && expirationDate) {
                        baseDate.setHours(23, 59, 59, 999);
                        expiresAt = baseDate.toISOString();
                    } else if (expirationType !== 'always') {
                        // Если выбраны дни, но время не выбрано — оставляем как есть
                        expiresAt = baseDate.toISOString();
                    } else {
                        expiresAt = null;
                    }
                }
            } else {
                // Бессрочно
                expiresAt = null;
            }

            // Если всё ещё null, но время выбрано — форсируем
            if (expiresAt === null && timeType !== 'none') {
                const now = new Date();
                let hours = 0, minutes = 0;
                if (timeType === '1hour') hours = 1;
                else if (timeType === '4hours') hours = 4;
                else if (timeType === '12hours') hours = 12;
                else if (timeType === 'custom') {
                    const parts = customTime.split(':');
                    if (parts.length === 2) {
                        const h = parseInt(parts[0], 10);
                        const m = parseInt(parts[1], 10);
                        if (!isNaN(h) && !isNaN(m) && h >= 0 && m >= 0) {
                            hours = h;
                            minutes = m;
                        }
                    }
                }
                if (hours > 0 || minutes > 0) {
                    now.setHours(now.getHours() + hours);
                    now.setMinutes(now.getMinutes() + minutes);
                    expiresAt = now.toISOString();
                }
            }

            // Проверка на прошедшее время
            if (expiresAt) {
                const now = new Date();
                if (new Date(expiresAt) <= now) {
                    message.warning('Выбранное время уже прошло. Пожалуйста, выберите другую дату или время.');
                    setLoading(false);
                    return;
                }
            }

            // --- КОНЕЦ ЛОГИКИ ---

            const finalPasswordView = passwordViewEnabled ? passwordView : null;
            const finalPasswordDownload = passwordDownloadEnabled ? passwordDownload : null;

            const result = await onCreateLinks({
                items: currentItems,
                linkType,
                expiresAt,
                allowDownload,
                passwordView: finalPasswordView,
                passwordDownload: finalPasswordDownload,
            });

            const hasError = Array.isArray(result) && result.some(item => item.status === 'error');

            if (hasError) {
                const errorMsg = result.find(item => item.status === 'error')?.errorMessage || 'Ошибка создания ссылок';
                message.error(errorMsg);
                updateTask(taskId, {
                    progress: 100,
                    completedAt: new Date().toISOString()
                });
                completeTask(taskId, 'error', errorMsg);
                setGeneratedLinks(result);
                setLoading(false);
                return;
            }

            let links = [];
            if (Array.isArray(result)) {
                links = result.map(item => item.link).filter(Boolean);
            } else if (result && result.url) {
                links = [result.url];
            } else if (result && result.links) {
                links = result.links;
            }

            updateTask(taskId, {
                progress: 100,
                details: {
                    linkType: linkType === 'individual' ? 'Отдельные ссылки' : 'Общая ссылка',
                    count: currentItems.length,
                    links: links,
                },
                completedAt: new Date().toISOString()
            });

            completeTask(taskId, 'done');

            setGeneratedLinks(result);
            if (fetchItems) {
                await fetchItems(currentFolderId);
            }
            clearUnfinishedAction('share');
        } catch (error) {
            const errorMsg = error?.response?.data?.message || error?.message || 'Ошибка создания ссылок';
            message.error(errorMsg);
            updateTask(taskId, {
                progress: 100,
                status: 'error',
                errorMessage: errorMsg,
                completedAt: new Date().toISOString()
            });
            completeTask(taskId, 'error', errorMsg);
            console.error('Ошибка создания ссылок:', error);
        } finally {
            setLoading(false);
        }
    };

    const hasDateSelected = expirationType === 'date';

    return {
        visible,
        selectedItems: currentItems,
        currentItems,
        loading,
        generatedLinks,
        removeItem,
        linkType,
        setLinkType,
        expirationType,
        setExpirationType,
        customDays,
        setCustomDays,
        expirationDate,
        setExpirationDate,
        timeType,
        setTimeType,
        customTime,
        setCustomTime,
        hasDateSelected,
        allowDownload,
        setAllowDownload,
        passwordViewEnabled,
        setPasswordViewEnabled,
        passwordDownloadEnabled,
        setPasswordDownloadEnabled,
        passwordView,
        setPasswordView,
        passwordDownload,
        setPasswordDownload,
        open,
        close,
        cancel,
        handleCreateLinks,
    };
};