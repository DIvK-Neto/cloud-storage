import React, { useState, useEffect } from 'react';
import { Modal, Input, Form } from 'antd';

export const RenameModal = ({
    visible,
    onCancel,
    onConfirm,
    currentName = '',
    title = 'Переименовать',
    loading = false,
}) => {
    const [form] = Form.useForm();
    const [name, setName] = useState(currentName);

    useEffect(() => {
        if (visible) {
            setName(currentName);
            form.setFieldsValue({ name: currentName });
        }
    }, [visible, currentName, form]);

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
            title={title}
            onCancel={onCancel}
            onOk={handleOk}
            confirmLoading={loading}
            okText="Сохранить"
            cancelText="Отмена"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="name"
                    label="Новое имя"
                    rules={[
                        { required: true, message: 'Введите новое имя' },
                        { min: 1, message: 'Имя не может быть пустым' },
                        { max: 255, message: 'Имя слишком длинное' },
                    ]}
                >
                    <Input
                        placeholder="Введите новое имя"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};