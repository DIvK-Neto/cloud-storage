import React from 'react';

export const ModalHeader = ({ title, onClose, onSettingsClick, onHelpClick }) => {
    return (
        <div className="base-modal-header">
            <span className="base-modal-title">{title}</span>
            <div className="base-modal-actions">
                <button onClick={onSettingsClick} className="base-modal-icon-btn" title="Настройки">⚙️</button>
                <button onClick={onHelpClick} className="base-modal-icon-btn" title="Помощь">❓</button>
                <button onClick={onClose} className="base-modal-icon-btn" title="Закрыть">✕</button>
            </div>
        </div>
    );
};