import React from 'react';
import { Form, Input, Spin } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useSmartField } from './collections/smartField';
import { TooltipIcon } from './elements/TooltipIcon';
import './SmartField.css';

/**
 * Универсальный компонент поля с умной валидацией и тултипом.
 *
 * @param {string} name - имя поля (используется для Form.Item и хука)
 * @param {string} label - текст лейбла
 * @param {array} rules - правила валидации Ant Design
 * @param {string} placeholder - плейсхолдер
 * @param {ReactNode} icon - иконка в поле (из Ant Design)
 * @param {string} type - тип поля ('text' или 'password')
 * @param {boolean} showTooltip - показывать ли иконку с тултипом
 * @param {string} tooltipText - текст тултипа (если showTooltip === true)
 * @param {string} validateTrigger - когда запускать валидацию ('onChange', 'onBlur' и т.д.)
 * @param {object} form - экземпляр формы Ant Design
 * @param {object} fieldErrors - объект с серверными ошибками для полей
 * @param {function} setFieldErrors - функция для очистки серверных ошибок
 * @param {string} value - текущее значение поля (из Form.useWatch)
 * @param {function} onChange - дополнительный обработчик изменения (если нужен)
 * @param {boolean} disableCheck - отключить проверку занятости (для страницы входа)
 * @param {boolean} hideSuccess - отключить зелёную галочку (для страницы входа)
 * @returns {JSX.Element}
 */
export const SmartField = ({
    name,
    label,
    rules = [],
    placeholder = '',
    icon = null,
    type = 'text',
    showTooltip = false,
    tooltipText = '',
    validateTrigger = 'onChange',
    form,
    fieldErrors = {},
    setFieldErrors = () => { },
    value = '',
    onChange = () => { },
    disableCheck = false,
    hideSuccess = false,
}) => {
    // Используем хук-координатор
    const {
        status,
        help,
        loading,
        handleChange,
        openTooltip,
        closeTooltip,
        toggleTooltip,
        clearFeedback,
        suffix,
    } = useSmartField(name, value, fieldErrors, setFieldErrors, form, rules, disableCheck);

    // Определяем, какой компонент ввода использовать (обычный или пароль)
    const InputComponent = type === 'password' ? Input.Password : Input;

    // Определяем, есть ли ошибка (для установки статуса)
    const hasError = status === 'error';

    // ← НОВАЯ ФУНКЦИЯ (5 строк)
    const renderSuffix = () => {
        if (loading) return <Spin size="small" />;
        // Показываем зелёную галочку только если hideSuccess === false
        if (!hideSuccess && status === 'success' && value?.length > 0) {
            return <CheckCircleOutlined style={{ color: 'green' }} />;
        }
        return null;
    };

    // Функция для определения значения autoComplete
    const getAutoComplete = () => {
        if (type === 'password') return 'new-password';
        if (name === 'login') return 'username';
        if (name === 'email') return 'email';
        if (name === 'fullName') return 'name';
        return 'off';
    };

    // Обработчик изменения поля
    const onFieldChange = (e) => {
        // Очищаем подсказки и серверные ошибки
        handleChange();
        // Вызываем родительский onChange (если передан)
        onChange(e);
        // Принудительно запускаем валидацию Ant Design (если форма передана)
        if (form && name) {
            form.validateFields([name]);
        }
    };

    // Рендерим поле
    return (
        <Form.Item
            label={label}
            name={name}
            rules={rules}
            validateTrigger={validateTrigger}
            validateStatus={status || undefined}
            help={help || undefined}
            hasFeedback={false}
        >
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <InputComponent
                    prefix={icon}
                    placeholder={placeholder}
                    onChange={onFieldChange}
                    suffix={renderSuffix()}
                    autoComplete={getAutoComplete()}
                />
                {showTooltip && tooltipText && (
                    <TooltipIcon text={tooltipText} placement="top" />
                )}
            </div>
        </Form.Item>
    );
};