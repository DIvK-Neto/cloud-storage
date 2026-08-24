import React from 'react';
import { Card, Typography } from 'antd';
import { LoginForm } from './elements/LoginForm';
import { useLogin } from './primitives/hooks/useLogin';
import './Login.css';

const { Title } = Typography;

export const Login = () => {
    const { loading, submitLogin, fieldErrors, setFieldErrors } = useLogin();

    const onFinish = async (values) => {
        const result = await submitLogin(values);
        if (result.success) {
            console.log('Вход выполнен успешно!');
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Ошибки валидации:', errorInfo);
    };

    return (
        <div className="login-container">
            <Card className="login-card">
                <Title level={2} className="login-title">Вход</Title>
                <LoginForm
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    loading={loading}
                    fieldErrors={fieldErrors}
                    setFieldErrors={setFieldErrors}
                />
                <div className="register-link">
                    Нет аккаунта? <a href="/register">Зарегистрируйтесь</a>
                </div>
            </Card>
        </div>
    );
};