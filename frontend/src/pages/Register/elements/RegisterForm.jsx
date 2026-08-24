import React, { useState, useEffect } from 'react';
import { Form, Button } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, IdcardOutlined } from '@ant-design/icons';
import { SmartField } from "../../../components/all_components";
import { emailValidator, fullNameValidator, passwordValidator, usernameValidator } from '../collections/validators';

export const RegisterForm = ({ onFinish, onFinishFailed, loading, fieldErrors, setFieldErrors, form }) => {
    const [loginValue, setLoginValue] = useState('');
    const [emailValue, setEmailValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');

    const onValuesChange = (changedValues, allValues) => {
        if (changedValues.login !== undefined) setLoginValue(changedValues.login);
        if (changedValues.email !== undefined) setEmailValue(changedValues.email);
        if (changedValues.password !== undefined) setPasswordValue(changedValues.password);
    };

    useEffect(() => {
        if (form) {
            const values = form.getFieldsValue(['login', 'email', 'password']);
            if (values.login !== undefined) setLoginValue(values.login);
            if (values.email !== undefined) setEmailValue(values.email);
            if (values.password !== undefined) setPasswordValue(values.password);
        }
    }, [form]);

    const loginTooltip =
        "Логин должен:\n• начинаться с буквы\n• содержать только латинские буквы и цифры\n• длина от 4 до 20 символов\n\nЗапрещены: пробелы, спецсимволы, кириллица";

    const passwordTooltip =
        "Пароль должен содержать:\n• минимум 6 символов\n• одну заглавную букву (A–Z)\n• одну цифру (0–9)\n• один спецсимвол\n\nРазрешены только латинские буквы, цифры и спецсимволы.";

    return (
        <Form
            name="register"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            form={form}
            autoComplete="off"
            onValuesChange={onValuesChange}
        >
            {/* Обман браузера: скрытые поля для логина и пароля */}
            <input type="text" name="username" style={{ display: 'none' }} />
            <input type="password" name="password" style={{ display: 'none' }} />

            <SmartField
                name="login"
                label="Логин"
                rules={usernameValidator}
                placeholder="Введите логин"
                icon={<UserOutlined />}
                type="text"
                showTooltip={true}
                tooltipText={loginTooltip}
                validateTrigger="onChange"
                form={form}
                fieldErrors={fieldErrors}
                setFieldErrors={setFieldErrors}
                value={loginValue}
            />

            <SmartField
                name="fullName"
                label="Полное имя"
                rules={fullNameValidator}
                placeholder="Введите полное имя"
                icon={<IdcardOutlined />}
                type="text"
                showTooltip={false}
                validateTrigger="onChange"
                form={form}
                fieldErrors={fieldErrors}
                setFieldErrors={setFieldErrors}
            />

            <SmartField
                name="email"
                label="Email"
                rules={emailValidator}
                placeholder="Введите email"
                icon={<MailOutlined />}
                type="text"
                showTooltip={false}
                validateTrigger="onChange"
                form={form}
                fieldErrors={fieldErrors}
                setFieldErrors={setFieldErrors}
                value={emailValue}
            />

            <SmartField
                name="password"
                label="Пароль"
                rules={passwordValidator}
                placeholder="Введите пароль"
                icon={<LockOutlined />}
                type="password"
                showTooltip={true}
                tooltipText={passwordTooltip}
                validateTrigger="onChange"
                form={form}
                fieldErrors={fieldErrors}
                setFieldErrors={setFieldErrors}
                value={passwordValue}
            />

            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading} block>
                    Зарегистрироваться
                </Button>
            </Form.Item>
        </Form>
    );
};
