import { useState } from 'react';

/**
 * Хук для управления подсказками под полем
 * @returns {Object} - { feedback, setFeedback, clearFeedback, status, setStatus }
 */
export const useFieldFeedback = () => {
    // Текст подсказки (ошибка, предупреждение или подсказка)
    const [feedback, setFeedback] = useState('');
    // Статус поля: '' (норма), 'error' (ошибка), 'success' (успех)
    const [status, setStatus] = useState('');

    // Очистить подсказку и сбросить статус
    const clearFeedback = () => {
        setFeedback('');
        setStatus('');
    };

    return {
        feedback,      // текущий текст подсказки
        setFeedback,   // установить подсказку
        status,        // текущий статус ('error', 'success', '')
        setStatus,     // установить статус
        clearFeedback, // очистить подсказку и статус
    };
};