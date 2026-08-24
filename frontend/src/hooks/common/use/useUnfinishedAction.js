import { useContext } from 'react';
import { SettingsContext } from '../../../context/SettingsContext';

/**
 * Хук для работы с незавершёнными действиями.
 * Использует SettingsContext для хранения состояния в localStorage.
 */
export const useUnfinishedAction = () => {
    const {
        unfinishedActions,
        setUnfinishedAction: setUnfinished,
        clearUnfinishedAction: clearUnfinished,
        getUnfinishedAction: getUnfinished,
    } = useContext(SettingsContext);

    /**
     * Проверить, есть ли незавершённое действие для конкретной кнопки.
     * @param {string} key - идентификатор кнопки ('share', 'download', и т.д.)
     * @returns {boolean}
     */
    const hasUnfinishedAction = (key) => {
        return !!unfinishedActions[key];
    };

    /**
     * Получить все незавершённые действия.
     * @returns {Object} - объект { key: data, ... }
     */
    const getAllUnfinishedActions = () => {
        return unfinishedActions;
    };

    /**
     * Получить список ключей всех незавершённых действий.
     * @returns {string[]}
     */
    const getUnfinishedKeys = () => {
        return Object.keys(unfinishedActions);
    };

    /**
     * Проверить, есть ли хотя бы одно незавершённое действие.
     * @returns {boolean}
     */
    const hasAnyUnfinished = () => {
        return Object.keys(unfinishedActions).length > 0;
    };

    return {
        setUnfinishedAction: setUnfinished,
        clearUnfinishedAction: clearUnfinished,
        getUnfinishedAction: getUnfinished,
        hasUnfinishedAction,
        getAllUnfinishedActions,
        getUnfinishedKeys,
        hasAnyUnfinished,
    };
};