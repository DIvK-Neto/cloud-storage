import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { checkLogin, checkEmail } from '../../../api/all_api';

export const useFieldCheck = (fieldName, value) => {
    const [isValid, setIsValid] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [checking, setChecking] = useState(false);

    const debouncedValue = useDebounce(value, 500);

    useEffect(() => {
        // Если значение пустое или меньше минимальной длины — не проверяем
        if (!debouncedValue || debouncedValue.length < 3) {
            setIsValid(true);
            setErrorMessage('');
            setChecking(false);
            return;
        }

        const checkField = async () => {
            setChecking(true);
            try {
                let response;
                if (fieldName === 'login') {
                    response = await checkLogin(debouncedValue);
                } else if (fieldName === 'email') {
                    response = await checkEmail(debouncedValue);
                } else {
                    // Для других полей — не проверяем
                    setIsValid(true);
                    setErrorMessage('');
                    setChecking(false);
                    return;
                }

                if (response.data.exists) {
                    setIsValid(false);
                    setErrorMessage(fieldName === 'login' ? 'Этот логин уже занят' : 'Этот email уже используется');
                } else {
                    setIsValid(true);
                    setErrorMessage('');
                }
            } catch (error) {
                console.error('Ошибка проверки поля:', error);
                // В случае ошибки не блокируем пользователя
                setIsValid(true);
                setErrorMessage('');
            } finally {
                setChecking(false);
            }
        };

        checkField();
    }, [debouncedValue, fieldName]);

    return { isValid, errorMessage, checking };
};

