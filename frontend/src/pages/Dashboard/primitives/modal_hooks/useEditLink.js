import { useState } from 'react';
import { message } from 'antd';
import api from '../../../../api/axios';

export const useEditLink = (onExtend) => {
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingLinkId, setEditingLinkId] = useState(null);
    const [isCollection, setIsCollection] = useState(false);
    const [loading, setLoading] = useState(false);

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

    const openEditor = (link) => {
        setEditingLinkId(link.id);
        setIsCollection(link.type === 'collection');

        if (link.type === 'collection') {
            setAllowDownload(link.allow_download !== undefined ? link.allow_download : true);
        } else {
            setAllowDownload(link.link_type === 'download');
        }

        const hasPasswordView = link.password_view && link.password_view.length > 0;
        const hasPasswordDownload = link.password_download && link.password_download.length > 0;

        setPasswordViewEnabled(hasPasswordView);
        setPasswordDownloadEnabled(hasPasswordDownload);
        setPasswordView(link.password_view || '');
        setPasswordDownload(link.password_download || '');

        if (!link.expires_at) {
            setExpirationType('always');
            setCustomDays('');
            setExpirationDate(null);
        } else {
            const diff = new Date(link.expires_at) - new Date();
            const days = diff / (1000 * 60 * 60 * 24);
            if (days <= 1) setExpirationType('1day');
            else if (days <= 3) setExpirationType('3days');
            else if (days <= 7) setExpirationType('7days');
            else {
                setExpirationType('date');
                setExpirationDate(new Date(link.expires_at));
            }
            setCustomDays('');
        }
        setTimeType('none');
        setCustomTime('');

        setEditModalVisible(true);
    };

    const closeEditor = () => {
        setEditModalVisible(false);
        setEditingLinkId(null);
        setIsCollection(false);
    };

    const saveLink = async () => {
        if (!editingLinkId) return;
        setLoading(true);

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

        // Проверка: если есть expiresAt и он в прошлом — предупреждение
        if (expiresAt) {
            const now = new Date();
            if (new Date(expiresAt) <= now) {
                message.warning('Выбранное время уже прошло. Пожалуйста, выберите другую дату или время.');
                setLoading(false);
                return;
            }
        }

        // --- КОНЕЦ ЛОГИКИ ---

        try {
            let payload = {};
            if (isCollection) {
                payload = {
                    expires_at: expiresAt,
                    allow_download: allowDownload,
                    allow_comments: allowDownload,
                    password_view: passwordViewEnabled ? passwordView : null,
                    password_download: passwordDownloadEnabled ? passwordDownload : null,
                };
            } else {
                const linkType = allowDownload ? 'download' : 'view';
                payload = {
                    link_type: linkType,
                    expires_at: expiresAt,
                    allow_comments: allowDownload,
                    password_view: passwordViewEnabled ? passwordView : null,
                    password_download: passwordDownloadEnabled ? passwordDownload : null,
                };
            }

            const url = isCollection
                ? `/share/update-collection/${editingLinkId}/`
                : `/share/update/${editingLinkId}/`;

            await api.patch(url, payload);
            message.success('Ссылка обновлена');
            closeEditor();
            if (onExtend) onExtend(editingLinkId, expiresAt);
        } catch (error) {
            const msg = error.response?.data?.detail || error.response?.data?.error || 'Ошибка обновления ссылки';
            message.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return {
        editModalVisible,
        loading,
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
        openEditor,
        closeEditor,
        saveLink,
    };
};