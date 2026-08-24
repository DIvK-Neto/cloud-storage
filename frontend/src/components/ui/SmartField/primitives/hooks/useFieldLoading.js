import { useState } from 'react';

/**
 * Хук для управления состоянием загрузки (спиннер)
 * @returns {Object} - { loading, setLoading, startLoading, stopLoading }
 */
export const useFieldLoading = () => {
    // Флаг загрузки: true — показывать спиннер, false — скрыть
    const [loading, setLoading] = useState(false);

    // Включить спиннер
    const startLoading = () => setLoading(true);

    // Выключить спиннер
    const stopLoading = () => setLoading(false);

    return {
        loading,        // текущее состояние загрузки
        setLoading,     // установить вручную
        startLoading,   // включить спиннер
        stopLoading,    // выключить спиннер
    };
};