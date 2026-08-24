import React from 'react';
import { Card, Typography, Form } from 'antd';
import { RegisterForm } from './elements/RegisterForm';
import { useRegister } from './primitives/hooks/useRegister';
import './Register.css';

const { Title } = Typography;

export const Register = () => {
    const { loading, submitRegister, fieldErrors, setFieldErrors } = useRegister();
    const [form] = Form.useForm();

    const onFinish = async (values) => {
        const result = await submitRegister(values);
        if (result.success) {
            console.log('Регистрация успешна!');
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Ошибки валидации:', errorInfo);
    };

    return (
        <div className="register-container">
            <Card className="register-card">
                <Title level={2} className="register-title">Регистрация</Title>
                <RegisterForm
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    loading={loading}
                    fieldErrors={fieldErrors}
                    setFieldErrors={setFieldErrors}
                    form={form}
                />
                <div className="login-link">
                    Уже есть аккаунт? <a href="/login">Войдите</a>
                </div>
            </Card>
        </div>
    );
};