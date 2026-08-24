import { useState } from 'react';

/**
 * Хук для управления модалкой загрузки файлов.
 * @returns {Object} - { visible, open, close }
 */
export const useUploadModal = () => {
    const [visible, setVisible] = useState(false);

    const open = () => setVisible(true);
    const close = () => setVisible(false);

    return {
        visible,
        open,
        close,
    };
};