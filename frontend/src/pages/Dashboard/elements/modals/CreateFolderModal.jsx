import React, { useState, useEffect } from 'react';
import { Modal, Input, Form } from 'antd';

export const CreateFolderModal = ({
    visible,
    onCancel,
    onConfirm,
    loading = false,
}) => {
    const [form] = Form.useForm();
    const [name, setName] = useState('');

    useEffect(() => {
        if (visible) {
            setName('');
            form.resetFields();
        }
    }, [visible, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            onConfirm(values.name);
        } catch (error) {
            // Валидация не пройдена
        }
    };

    return (
        <Modal
            open={visible}
            title="Создать папку"
            onCancel={onCancel}
            onOk={handleOk}
            confirmLoading={loading}
            okText="Создать"
            cancelText="Отмена"
            destroyOnHidden
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Имя папки"
                    rules={[
                        { required: true, message: 'Введите имя папки' },
                        { min: 1, message: 'Имя не может быть пустым' },
                        { max: 255, message: 'Имя слишком длинное' },
                    ]}
                >
                    <Input
                        placeholder="Введите имя папки"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};