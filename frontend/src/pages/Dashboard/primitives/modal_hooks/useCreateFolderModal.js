import { useState } from 'react';

/**
 * Хук для управления модалкой создания папки.
 * @param {Function} handleCreateFolder - функция создания папки (уже использует addItem).
 * @param {number|null} currentFolderId - ID текущей папки.
 * @returns {Object} - состояния и функции для модалки.
 */
export const useCreateFolderModal = (handleCreateFolder, currentFolderId) => {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const open = () => setVisible(true);
    const close = () => setVisible(false);

    const handleConfirm = async (name) => {
        setLoading(true);
        try {
            await handleCreateFolder(name, currentFolderId);
            close();
        } finally {
            setLoading(false);
        }
    };

    return {
        visible,
        open,
        close,
        loading,
        handleConfirm,
    };
};