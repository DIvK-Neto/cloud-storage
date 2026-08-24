import { useState, useEffect } from 'react';
import { useDebounce } from '../../../../../hooks/all_hooks';
import { useFieldCheck } from '../../../../../hooks/all_hooks';

/**
 * Хук для проверки поля на лету (занятость, серверные ошибки)
 * @param {string} fieldName - имя поля (login или email)
 * @param {string} value - текущее значение поля
 * @param {object} serverErrors - объект с ошибками с сервера (из fieldErrors)
 * @param {boolean} disableCheck - отключить проверку занятости (для страницы входа)
 * @returns {object} - { isValid, errorMessage, checking, setServerError, clearError }
 */
export const useFieldValidation = (fieldName, value, serverErrors = {}, disableCheck = false) => {
    // Состояние: валидно ли поле (true — ошибок нет)
    const [isValid, setIsValid] = useState(true);
    // Сообщение об ошибке (если есть)
    const [errorMessage, setErrorMessage] = useState('');
    // Идёт ли проверка (спиннер)
    const [checking, setChecking] = useState(false);

    // Задержка для проверки на лету (500 мс)
    const debouncedValue = useDebounce(value, 500);

    // Проверка занятости через useFieldCheck
    const fieldCheck = useFieldCheck(fieldName, debouncedValue);

    // Эффект для проверки занятости при изменении debouncedValue
    useEffect(() => {
        // Если проверка отключена — всегда считаем поле валидным (без занятости)
        if (disableCheck) {
            setIsValid(true);
            setErrorMessage('');
            setChecking(false);
            return;
        }

        // Если значение пустое или короче 3 символов — не проверяем
        if (!debouncedValue || debouncedValue.length < 3) {
            setIsValid(true);
            setErrorMessage('');
            setChecking(false);
            return;
        }

        // Проверяем, есть ли ошибка с сервера для этого поля (приоритет выше)
        const serverError = serverErrors[fieldName];
        if (serverError) {
            setIsValid(false);
            setErrorMessage(serverError);
            setChecking(false);
            return;
        }

        // Если проверка на занятость вернула ошибку
        if (fieldCheck && !fieldCheck.isValid) {
            setIsValid(false);
            setErrorMessage(fieldCheck.errorMessage || 'Это поле уже занято');
            setChecking(fieldCheck.checking || false);
            return;
        }

        // Если всё хорошо
        setIsValid(true);
        setErrorMessage('');
        setChecking(false);

    }, [debouncedValue, fieldName, fieldCheck, serverErrors, disableCheck]);

    // Функция для ручной установки ошибки с сервера (после отправки формы)
    const setServerError = (error) => {
        if (error) {
            setIsValid(false);
            setErrorMessage(error);
        } else {
            setIsValid(true);
            setErrorMessage('');
        }
    };

    // Очистить ошибку
    const clearError = () => {
        setIsValid(true);
        setErrorMessage('');
    };

    return {
        isValid,        // true — ошибок нет, false — есть ошибка
        errorMessage,   // текст ошибки (если есть)
        checking,       // true — идёт проверка (спиннер)
        setServerError, // установить ошибку с сервера
        clearError,     // очистить ошибку
    };
};