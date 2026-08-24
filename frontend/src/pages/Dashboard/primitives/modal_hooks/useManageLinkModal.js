import { useState } from 'react';
import { message } from 'antd';
import api from '../../../../api/axios';

/**
 * Хук для управления модалкой «Управление ссылкой».
 * @param {Function} updateItem - функция обновления элемента в локальном списке.
 * @param {Function} refreshStats - функция обновления статистики (опционально).
 * @param {number|null} currentFolderId - ID текущей папки (оставлен для совместимости).
 * @returns {Object} состояния и методы для модалки
 */
export const useManageLinkModal = (updateItem, refreshStats, currentFolderId) => {
    const [visible, setVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [links, setLinks] = useState([]);

    // Вспомогательная функция для перезагрузки списка ссылок
    const refreshLinks = async () => {
        if (!selectedItem) return;
        try {
            const response = await api.get('/share/links/', {
                params: {
                    item_id: selectedItem.id,
                    type: selectedItem.type,
                },
            });
            const updatedLinks = response.data;
            setLinks(updatedLinks);

            // Обновляем элемент в главной таблице в зависимости от наличия ссылок
            if (updateItem) {
                const hasLink = updatedLinks.length > 0;
                updateItem({ ...selectedItem, has_share_link: hasLink });
            }

            // Если ссылок не осталось, закрываем модалку с задержкой
            if (updatedLinks.length === 0) {
                setTimeout(() => close(), 0);
            }
            return updatedLinks;
        } catch (error) {
            console.error('Ошибка загрузки данных ссылок:', error);
            setLinks([]);
            return [];
        }
    };

    const open = async (item) => {
        setSelectedItem(item);
        setVisible(true);
        setLoading(true);
        try {
            const response = await api.get('/share/links/', {
                params: {
                    item_id: item.id,
                    type: item.type,
                },
            });
            setLinks(response.data);
        } catch (error) {
            console.error('Ошибка загрузки данных ссылок:', error);
            setLinks([]);
        } finally {
            setLoading(false);
        }
    };

    const close = () => {
        setVisible(false);
        setSelectedItem(null);
        setLinks([]);
    };

    const handleDelete = async (linkId, linkType) => {
        setLoading(true);
        try {
            const url = linkType === 'collection'
                ? `/share/update-collection/${linkId}/`
                : `/share/update/${linkId}/`;
            await api.delete(url);
            message.success('Ссылка удалена');

            if (refreshStats) {
                await refreshStats();
            }

            await refreshLinks();
        } catch (error) {
            const errorMsg = error.response?.data?.error || 'Ошибка удаления ссылки';
            message.error(errorMsg);
            console.error('Ошибка удаления ссылки:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExtend = async (linkId, newExpiration) => {
        setLoading(true);
        try {
            await refreshLinks();
            message.success('Ссылка обновлена');
        } catch (error) {
            console.error('Ошибка обновления ссылки:', error);
        } finally {
            setLoading(false);
        }
    };

    return {
        visible,
        selectedItem,
        loading,
        links,
        open,
        close,
        handleDelete,
        handleExtend,
    };
};