import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { login } from "../../../../api/all_api";
import { useAuth } from '../../../../hooks/auth/collections/auth';

export const useLogin = () => {
    const navigate = useNavigate();
    const { login: setAuthUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const submitLogin = async (values) => {
        setLoading(true);
        setFieldErrors({});

        try {
            const credentials = {
                login: values.login,
                password: values.password,
            };


            const response = await login(credentials);


            // Сохраняем в контекст
            if (response.data.user) {
                setAuthUser(response.data.user);
            }

            message.success('Вход выполнен успешно!');
            navigate('/dashboard');

            return { success: true, data: response.data };

        } catch (error) {

            let fieldErrors = {};

            if (error.response) {

                if (error.response.status === 401) {
                    const data = error.response.data;
                    const errorMessage = data?.message || data?.error || data?.detail || 'Неверный логин или пароль.';
                    fieldErrors.login = errorMessage;
                    fieldErrors.password = errorMessage;
                }
                else if (error.response.status === 400) {
                    const data = error.response.data;
                    if (data.login) {
                        fieldErrors.login = data.login.join(' ');
                    }
                    if (data.password) {
                        fieldErrors.password = data.password.join(' ');
                    }
                }
            }

            setFieldErrors(fieldErrors);

            let errorMessage = 'Не удалось подключиться к серверу. Проверьте, запущен ли бэкенд.';
            if (error.response) {
                const data = error.response.data;
                errorMessage = data?.message || data?.error || data?.detail || 'Неверный логин или пароль.';
            }

            if (Object.keys(fieldErrors).length === 0) {
                message.error(errorMessage);
            }

            return { success: false, error: errorMessage, fieldErrors };

        } finally {
            setLoading(false);
        }
    };

    return { loading, submitLogin, fieldErrors, setFieldErrors };
};