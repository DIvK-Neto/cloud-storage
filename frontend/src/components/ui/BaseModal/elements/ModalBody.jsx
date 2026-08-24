import React from 'react';

export const ModalBody = ({
    children,
    showFilter,
    isFilterOn,
    onToggleFilter,
    searchQuery,
    onSearchChange,
    filterType,
    onFilterTypeChange,
    dateFrom,
    onDateFromChange,
    dateTo,
    onDateToChange,
    isSettingsOpen,
    onBack,              // <-- ДОБАВЛЕНО
    modalKeepOnClose,
    toggleModalKeepOnClose,
}) => {
    // Если открыты настройки — рендерим страницу настроек
    if (isSettingsOpen) {
        return (
            <div className="base-modal-body">
                <div className="base-modal-settings-page">
                    <button className="base-modal-back-btn" onClick={onBack}>
                        ← Назад
                    </button>
                    <h3>Настройки окна</h3>
                    <label>
                        <input
                            type="checkbox"
                            checked={modalKeepOnClose}
                            onChange={toggleModalKeepOnClose}
                        />
                        Сохранять при случайном закрытии
                    </label>
                    <p className="base-modal-settings-hint">
                        Если включено, введённые данные сохраняются при закрытии модалки
                    </p>
                </div>
            </div>
        );
    }

    // Основное содержимое (фильтры + children)
    return (
        <div className="base-modal-body">
            {showFilter && (
                <div className="base-modal-filters">
                    <label>
                        <input
                            type="checkbox"
                            checked={isFilterOn}
                            onChange={onToggleFilter}
                        />
                        Показать только проблемные
                    </label>
                    {searchQuery !== undefined && (
                        <input
                            type="text"
                            placeholder="Поиск по имени..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                        />
                    )}
                    {filterType !== undefined && (
                        <select
                            value={filterType || ''}
                            onChange={(e) => onFilterTypeChange(e.target.value || null)}
                        >
                            <option value="">Все типы</option>
                            <option value="file">Файлы</option>
                            <option value="folder">Папки</option>
                        </select>
                    )}
                    {(dateFrom !== undefined || dateTo !== undefined) && (
                        <div>
                            <input
                                type="date"
                                value={dateFrom || ''}
                                onChange={(e) => onDateFromChange(e.target.value || null)}
                            />
                            <span>—</span>
                            <input
                                type="date"
                                value={dateTo || ''}
                                onChange={(e) => onDateToChange(e.target.value || null)}
                            />
                        </div>
                    )}
                </div>
            )}

            <div className="base-modal-content">
                {children}
            </div>
        </div>
    );
};