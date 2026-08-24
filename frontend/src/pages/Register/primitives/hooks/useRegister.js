import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { register } from "../../../../api/all_api";
import { useAuth } from '../../../../hooks/auth/collections/auth';

export const useRegister = () => {
    const navigate = useNavigate();
    const { login: setAuthUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const submitRegister = async (values) => {
        setLoading(true);
        setFieldErrors({});

        try {
            const userData = {
                login: values.login,
                full_name: values.fullName,
                email: values.email,
                password: values.password,
            };


            const response = await register(userData);


            // Сохраняем в контекст (автологин)
            if (response.data.user) {
                setAuthUser(response.data.user);
            }

            message.success('Регистрация успешна! Вы вошли в систему.');
            navigate('/dashboard');

            return { success: true, data: response.data, fieldErrors: {} };

        } catch (error) {

            let fieldErrors = {};

            if (error.response && error.response.status === 400) {
                const data = error.response.data;

                if (data.login) {
                    fieldErrors.login = data.login.join(' ');
                }
                if (data.email) {
                    fieldErrors.email = data.email.join(' ');
                }
                if (data.full_name) {
                    fieldErrors.fullName = data.full_name.join(' ');
                }
                if (data.password) {
                    fieldErrors.password = data.password.join(' ');
                }
            }

            setFieldErrors(fieldErrors);

            let errorMessage = 'Не удалось подключиться к серверу. Проверьте, запущен ли бэкенд.';
            if (error.response) {
                const data = error.response.data;
                errorMessage = data?.message || data?.error || data?.detail || data?.non_field_errors?.[0] || 'Ошибка регистрации. Проверьте введённые данные.';
            }

            if (Object.keys(fieldErrors).length === 0) {
                message.error(errorMessage);
            }

            return { success: false, error: errorMessage, fieldErrors };

        } finally {
            setLoading(false);
        }
    };

    return { loading, submitRegister, fieldErrors, setFieldErrors };
};