import React from 'react';

export const ModalFooter = ({
    actionLabel,
    onAction,
    onCancel,
    isLoading = false,
    isActionDisabled = false,
    showActionButton = true,
    showCancelButton = true, // <-- НОВЫЙ ПРОП
}) => {
    return (
        <div className="base-modal-footer">
            {showActionButton && (
                <button
                    className="base-modal-action-btn"
                    onClick={onAction}
                    disabled={isLoading || isActionDisabled}
                >
                    {isLoading ? 'Загрузка...' : actionLabel}
                </button>
            )}
            {showCancelButton && (
                <button className="base-modal-cancel-btn" onClick={onCancel}>
                    Отмена
                </button>
            )}
        </div>
    );
};