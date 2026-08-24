import { useState } from 'react';

/**
 * Хук для управления тултипом (всплывающей подсказкой)
 * @returns {Object} - { visible, open, close, toggle }
 */
export const useFieldTooltip = () => {
    // Флаг видимости тултипа
    const [visible, setVisible] = useState(false);

    // Открыть тултип
    const open = () => setVisible(true);

    // Закрыть тултип
    const close = () => setVisible(false);

    // Переключить тултип (если открыт → закрыть, если закрыт → открыть)
    const toggle = () => setVisible(prev => !prev);

    return {
        visible,   // текущее состояние видимости
        open,      // открыть тултип
        close,     // закрыть тултип
        toggle,    // переключить
    };
};