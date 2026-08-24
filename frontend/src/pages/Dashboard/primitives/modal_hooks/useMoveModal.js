import { useState } from 'react';

/**
 * Хук для управления модалкой перемещения.
 * @param {Function} handleMoveItem - функция перемещения (уже использует removeItem).
 * @param {number|null} currentFolderId - ID текущей папки.
 * @returns {Object} - состояния и функции для модалки.
 */
export const useMoveModal = (handleMoveItem, currentFolderId) => {
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

    const handleConfirm = async (newFolderId) => {
        if (!selectedItem) return;
        setLoading(true);
        try {
            await handleMoveItem(selectedItem, newFolderId);
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
        currentFolderId, // <-- добавлено
    };
};