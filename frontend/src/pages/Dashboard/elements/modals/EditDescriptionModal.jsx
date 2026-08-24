import React, { useState, useEffect } from 'react';
import { BaseModal } from '../../../../components/ui/all_ui';
import { useSettings } from '../../../../hooks/common/use/useSettings';

export const EditDescriptionModal = ({
    visible,
    onCancel,
    onConfirm,
    currentDescription = '',
    itemName = '',
    loading = false,
}) => {
    const [description, setDescription] = useState(currentDescription);
    const { modalKeepOnClose } = useSettings();

    const storageKey = `edit_desc_${itemName}`;

    useEffect(() => {
        if (visible) {
            if (modalKeepOnClose) {
                const saved = localStorage.getItem(storageKey);
                if (saved !== null) {
                    setDescription(saved);
                    return;
                }
            }
            setDescription(currentDescription);
        }
    }, [visible, currentDescription, modalKeepOnClose, storageKey]);

    const handleClose = () => {
        if (modalKeepOnClose) {
            localStorage.setItem(storageKey, description);
        } else {
            localStorage.removeItem(storageKey);
        }
        onCancel();
    };

    const handleSave = () => {
        localStorage.removeItem(storageKey);
        onConfirm(description);
    };

    const helpText =
        'Введите новое описание для файла или папки.\n' +
        'Нажмите «Сохранить» для применения.\n' +
        'При случайном закрытии текст сохранится, если включена настройка «Сохранять при случайном закрытии».';

    return (
        <BaseModal
            isOpen={visible}
            onClose={handleClose}
            onAction={handleSave}
            actionLabel="Сохранить"
            isLoading={loading}
            title={<span>Редактирование описания: <strong>{itemName}</strong></span>}
            showFilter={false}
            helpText={helpText}
        >
            <div style={{ marginTop: 16 }}>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Введите описание..."
                    style={{
                        width: '100%',
                        minHeight: 120,
                        padding: 8,
                        fontSize: 14,
                        borderRadius: 4,
                        border: '1px solid #d9d9d9',
                        resize: 'vertical',
                        boxSizing: 'border-box',
                    }}
                />
            </div>
        </BaseModal>
    );
};