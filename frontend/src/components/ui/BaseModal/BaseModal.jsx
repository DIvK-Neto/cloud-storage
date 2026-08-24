import React, { useState } from 'react';
import { Modal } from 'antd';
import { useSettings } from '../../../hooks/common/use/useSettings';
import { ModalHeader } from './elements/ModalHeader';
import { ModalFooter } from './elements/ModalFooter';
import { ModalTable } from './elements/ModalTable';
import './BaseModal.css';

export const BaseModal = ({
    isOpen,
    onClose,                // закрытие по ✕ и клик вне
    onCancel,               // ← НОВЫЙ ПРОП: для кнопки "Отмена"
    onAction,
    actionLabel,
    isLoading = false,
    isActionDisabled = false,
    showActionButton = true,
    showCancelButton = true,
    title,
    helpText = 'Используйте это окно для выполнения действия.',
    showFilter = false,
    isFilterOn = false,
    onToggleFilter,
    searchQuery,
    onSearchChange,
    filterType,
    onFilterTypeChange,
    dateFrom,
    onDateFromChange,
    dateTo,
    onDateToChange,
    showTable = false,
    items = [],
    columns = [],
    selectedItems = [],
    onSelect,
    onRowAction,
    renderCell,
    children,
}) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const { modalKeepOnClose, toggleModalKeepOnClose } = useSettings();

    const toggleSettings = () => setIsSettingsOpen(prev => !prev);
    const goBack = () => setIsSettingsOpen(false);

    const showHelp = () => {
        Modal.info({
            title: 'Справка',
            content: helpText,
            okText: 'Понятно',
        });
    };

    const renderContent = () => {
        if (isSettingsOpen) {
            return (
                <div style={{ padding: '24px', overflowY: 'auto' }}>
                    <button className="base-modal-back-btn" onClick={goBack}>← Назад</button>
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
            );
        }

        return (
            <div
                style={{
                    flex: 1,
                    minHeight: 0,
                    overflowY: 'auto',
                    padding: '24px',
                }}
            >
                {showTable ? (
                    <ModalTable
                        items={items}
                        columns={columns}
                        selectedItems={selectedItems}
                        onSelect={onSelect}
                        onRowAction={onRowAction}
                        renderCell={renderCell}
                    />
                ) : (
                    children
                )}
            </div>
        );
    };

    return (
        <Modal
            open={isOpen}
            onCancel={onClose}          // ✕ и клик вне → onClose
            footer={null}
            className="base-modal"
            width={800}
            closable={false}
            style={{ top: 100 }}
            styles={{
                body: {
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: 'calc(100vh - 200px)',
                    overflow: 'hidden',
                    padding: 0,
                },
            }}
        >
            <ModalHeader
                title={title}
                onClose={onClose}
                onSettingsClick={toggleSettings}
                onHelpClick={showHelp}
            />

            {renderContent()}

            <ModalFooter
                actionLabel={actionLabel}
                onAction={onAction}
                onCancel={onCancel || onClose}  // ← если onCancel передан — используем его, иначе onClose
                isLoading={isLoading}
                isActionDisabled={isActionDisabled}
                showActionButton={showActionButton}
                showCancelButton={showCancelButton}
            />
        </Modal>
    );
};