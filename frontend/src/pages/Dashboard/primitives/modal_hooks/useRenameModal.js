import { useState } from 'react';

/**
 * Хук для управления модалкой переименования.
 * @param {Function} handleRenameItem - функция переименования (уже использует updateItem).
 * @param {number|null} currentFolderId - ID текущей папки (оставлен для совместимости).
 * @returns {Object} - состояния и функции для модалки.
 */
export const useRenameModal = (handleRenameItem, currentFolderId) => {
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

    const handleConfirm = async (newName) => {
        if (!selectedItem) return;
        setLoading(true);
        try {
            await handleRenameItem(selectedItem, newName);
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