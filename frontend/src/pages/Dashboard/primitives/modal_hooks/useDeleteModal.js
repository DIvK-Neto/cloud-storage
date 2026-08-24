import { useState } from 'react';

/**
 * Хук для управления модалкой подтверждения удаления.
 * @param {Function} handleDeleteItem - функция удаления (уже использует removeItem).
 * @param {number|null} currentFolderId - ID текущей папки (оставлен для совместимости).
 * @returns {Object} - состояния и функции для модалки.
 */
export const useDeleteModal = (handleDeleteItem, currentFolderId) => {
    const [visible, setVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(false);

    const open = (item) => {
        setSelectedItem(item);
        setVisible(true);
    };

    const close = () => {
        setVisible(false);
        setSelectedItem(null);
    };

    const handleConfirm = async () => {
        if (!selectedItem) return;
        setLoading(true);
        try {
            await handleDeleteItem(selectedItem);
            close();
        } finally {
            setLoading(false);
        }
    };

    return {
        visible,
        selectedItem,
        loading,
        open,
        close,
        handleConfirm,
    };
};