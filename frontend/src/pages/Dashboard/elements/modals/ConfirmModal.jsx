import React from 'react';
import { Modal, Button, Space, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

export const ConfirmModal = ({
    visible,
    title = 'Подтверждение',
    content = 'Вы уверены?',
    onConfirm,
    onCancel,
    confirmText = 'Да',
    cancelText = 'Нет',
    danger = false,
    loading = false,
}) => {
    return (
        <Modal
            open={visible}
            title={title}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    {cancelText}
                </Button>,
                <Button
                    key="confirm"
                    type="primary"
                    danger={danger}
                    loading={loading}
                    onClick={onConfirm}
                >
                    {confirmText}
                </Button>,
            ]}
            centered
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <ExclamationCircleOutlined style={{ fontSize: 24, color: danger ? '#ff4d4f' : '#faad14' }} />
                <Text>{content}</Text>
            </div>
        </Modal>
    );
};