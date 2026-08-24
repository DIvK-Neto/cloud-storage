import React, { useState, useEffect } from 'react';
import { Form, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { SmartField } from "../../../components/all_components";
import { passwordValidator } from '../collections/validators';

export const LoginForm = ({ onFinish, onFinishFailed, loading, fieldErrors, setFieldErrors, form }) => {
    const [loginValue, setLoginValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');

    const onValuesChange = (changedValues, allValues) => {
        if (changedValues.login !== undefined) setLoginValue(changedValues.login);
        if (changedValues.password !== undefined) setPasswordValue(changedValues.password);
    };

    useEffect(() => {
        if (form) {
            const values = form.getFieldsValue(['login', 'password']);
            if (values.login !== undefined) setLoginValue(values.login);
            if (values.password !== undefined) setPasswordValue(values.password);
        }
    }, [form]);

    return (
        <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            form={form}
            autoComplete="on"
            onValuesChange={onValuesChange}
        >
            <SmartField
                name="login"
                label="Логин"
                rules={[{ required: true, message: 'Введите логин' }]}
                placeholder="Введите логин"
                icon={<UserOutlined />}
                type="text"
                showTooltip={false}
                validateTrigger="onChange"
                form={form}
                fieldErrors={fieldErrors}
                setFieldErrors={setFieldErrors}
                value={loginValue}
                disableCheck={true}
                hideSuccess={true}
            />

            <SmartField
                name="password"
                label="Пароль"
                rules={[{ required: true, message: 'Введите пароль' }]}
                placeholder="Введите пароль"
                icon={<LockOutlined />}
                type="password"
                showTooltip={false}
                validateTrigger="onChange"
                form={form}
                fieldErrors={fieldErrors}
                setFieldErrors={setFieldErrors}
                value={passwordValue}
                hideSuccess={true}
            />

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                    Войти
                </Button>
            </Form.Item>
        </Form>
    );
};