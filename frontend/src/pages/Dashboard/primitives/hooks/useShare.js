import { useCallback } from 'react';
import { message } from 'antd';
import api from '../../../../api/axios';

/**
 * Хук для создания специальных ссылок на файлы или папки.
 * @returns {Object} Функция handleCreateShareLink.
 */
export const useShare = () => {
    const handleCreateShareLink = useCallback(
        async ({ id, type, options = {} }) => {
            const { linkType = 'view', expiresAt = null, allowComments = false, passwordView = null, passwordDownload = null } = options;

            try {
                const payload = {
                    link_type: linkType,
                    expires_at: expiresAt,
                    allow_comments: allowComments,
                    password_view: passwordView,
                    password_download: passwordDownload,
                };

                if (type === 'file') {
                    payload.file = id;
                } else if (type === 'folder') {
                    payload.folder = id;
                } else {
                    throw new Error('Неизвестный тип элемента');
                }

                const res = await api.post('/share/create/', payload);
                const shareLink = res.data.uuid;
                const fullUrl = `${window.location.origin}/shared/${shareLink}`;
                await navigator.clipboard.writeText(fullUrl);
                message.success('Ссылка скопирована в буфер обмена');
                return fullUrl;
            } catch (err) {
                const msg = err.response?.data?.detail || 'Ошибка создания ссылки';
                message.error(msg);
                throw err;
            }
        },
        []
    );

    return {
        handleCreateShareLink,
    };
};