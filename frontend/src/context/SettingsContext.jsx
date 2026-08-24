import React, { createContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'settings';

export const SettingsContext = createContext(null);

export const SettingsProvider = ({ children }) => {
    const getInitialState = () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return {
                    pinned: parsed.pinned || false,
                    modalKeepOnClose: parsed.modalKeepOnClose || false,
                    actionPanelExpanded: parsed.actionPanelExpanded || false,
                    unfinishedActions: parsed.unfinishedActions || {},
                    dashboardPageSize: parsed.dashboardPageSize || 25, // ← ДОБАВЛЕНО
                };
            }
        } catch (e) { }
        return {
            pinned: false,
            modalKeepOnClose: false,
            actionPanelExpanded: false,
            unfinishedActions: {},
            dashboardPageSize: 25, // ← ДОБАВЛЕНО
        };
    };

    const [settings, setSettings] = useState(getInitialState);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (e) { }
    }, [settings]);

    const togglePinned = () => {
        setSettings(prev => ({ ...prev, pinned: !prev.pinned }));
    };

    const toggleModalKeepOnClose = () => {
        setSettings(prev => ({ ...prev, modalKeepOnClose: !prev.modalKeepOnClose }));
    };

    const toggleActionPanelExpanded = () => {
        setSettings(prev => ({ ...prev, actionPanelExpanded: !prev.actionPanelExpanded }));
    };

    // ===== НОВЫЕ МЕТОДЫ ДЛЯ НЕЗАВЕРШЁННЫХ ДЕЙСТВИЙ =====
    const setUnfinishedAction = (key, data) => {
        setSettings(prev => ({
            ...prev,
            unfinishedActions: {
                ...prev.unfinishedActions,
                [key]: data,
            },
        }));
    };

    const clearUnfinishedAction = (key) => {
        setSettings(prev => {
            const newActions = { ...prev.unfinishedActions };
            delete newActions[key];
            return {
                ...prev,
                unfinishedActions: newActions,
            };
        });
    };

    const getUnfinishedAction = (key) => {
        return settings.unfinishedActions[key] || null;
    };
    // ===== КОНЕЦ НОВЫХ МЕТОДОВ =====

    // ===== НОВЫЙ МЕТОД ДЛЯ РАЗМЕРА СТРАНИЦЫ =====
    const setDashboardPageSize = (size) => {
        setSettings(prev => ({ ...prev, dashboardPageSize: size }));
    };
    // ===== КОНЕЦ =====

    return (
        <SettingsContext.Provider
            value={{
                pinned: settings.pinned,
                modalKeepOnClose: settings.modalKeepOnClose,
                actionPanelExpanded: settings.actionPanelExpanded,
                unfinishedActions: settings.unfinishedActions,
                dashboardPageSize: settings.dashboardPageSize, // ← ДОБАВЛЕНО
                togglePinned,
                toggleModalKeepOnClose,
                toggleActionPanelExpanded,
                setUnfinishedAction,
                clearUnfinishedAction,
                getUnfinishedAction,
                setDashboardPageSize, // ← ДОБАВЛЕНО
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};