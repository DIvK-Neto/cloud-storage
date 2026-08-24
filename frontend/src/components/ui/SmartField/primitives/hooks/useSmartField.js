import { useFieldFeedback } from './useFieldFeedback';
import { useFieldLoading } from './useFieldLoading';
import { useFieldTooltip } from './useFieldTooltip';
import { useFieldValidation } from './useFieldValidation';

/**
 * Хук-координатор для умного поля.
 * Объединяет все под-хуки и предоставляет единый интерфейс.
 *
 * @param {string} fieldName - имя поля (например, 'login', 'email', 'password')
 * @param {string} value - текущее значение поля
 * @param {object} serverErrors - объект с ошибками с сервера (из fieldErrors)
 * @param {function} setServerErrors - функция для очистки ошибок поля (из родителя)
 * @param {object} form - экземпляр формы Ant Design (для проверки ошибок валидации)
 * @param {array} rules - правила валидации Ant Design (для ручной проверки)
 * @param {boolean} disableCheck - отключить проверку занятости (для страницы входа)
 * @returns {object} - все состояния и функции для SmartField
 */
export const useSmartField = (fieldName, value, serverErrors = {}, setServerErrors, form, rules = [], disableCheck = false) => {
    const feedback = useFieldFeedback();
    const loading = useFieldLoading();
    const tooltip = useFieldTooltip();
    const validation = useFieldValidation(fieldName, value, serverErrors, disableCheck);

    const getRuleErrors = () => {
        if (!rules || rules.length === 0) return null;

        // Если правила содержат только required (без min, max, pattern) — не выполняем ручную валидацию
        const hasComplexRules = rules.some(rule => rule.min || rule.max || rule.pattern);
        if (!hasComplexRules) {
            return null;
        }

        // Для пароля: отдельная логика
        if (fieldName === 'password') {
            // 1. Проверка допустимых символов (отдельная, чтобы не смешивать с другими pattern)
            const allowedPattern = /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};:'",.<>/?\\|`~]+$/;
            if (value && !allowedPattern.test(value)) {
                return 'Пароль может содержать только латинские буквы, цифры и спецсимволы';
            }

            // 2. Проверка длины
            for (const rule of rules) {
                if (rule.required) continue;
                if (rule.min && value && value.length < rule.min) {
                    return rule.message || `Минимум ${rule.min} символов`;
                }
            }

            // 3. Проверка остальных требований (только если длина >= 6)
            if (value && value.length >= 6) {
                // Заглавная буква
                if (!/[A-Z]/.test(value)) {
                    return 'Пароль должен содержать хотя бы одну заглавную букву (A–Z)';
                }
                // Цифра
                if (!/[0-9]/.test(value)) {
                    return 'Пароль должен содержать хотя бы одну цифру (0–9)';
                }
                // Спецсимвол
                if (!/[!@#$%^&*()_+\-=\[\]{};:'",.<>/?\\|`~]/.test(value)) {
                    return 'Пароль должен содержать хотя бы один спецсимвол';
                }
            }
            return null;
        }

        // Для остальных полей: сначала pattern, потом min, потом max
        for (const rule of rules) {
            if (rule.required) continue;
            if (rule.pattern && value && !rule.pattern.test(value)) {
                return rule.message || 'Некорректный формат';
            }
        }

        // Явная проверка для username (кириллица и т.п.)
        if (fieldName === 'username' && value && /[^A-Za-z0-9]/.test(value)) {
            return 'Логин должен содержать только латинские буквы и цифры';
        }

        for (const rule of rules) {
            if (rule.required) continue;
            if (rule.min && value && value.length < rule.min) {
                return rule.message || `Минимум ${rule.min} символов`;
            }
            if (rule.max && value && value.length > rule.max) {
                return rule.message || `Максимум ${rule.max} символов`;
            }
        }

        return null;
    };

    const handleChange = () => {
        if (feedback.feedback) {
            feedback.clearFeedback();
        }
        if (setServerErrors && serverErrors[fieldName]) {
            setServerErrors((prev) => ({ ...prev, [fieldName]: null }));
        }
    };

    const getFieldHelp = () => {
        const ruleError = getRuleErrors();
        if (ruleError) return ruleError;

        const antdErrors = form?.getFieldError(fieldName);
        if (antdErrors && antdErrors.length > 0) {
            return antdErrors[0];
        }

        if (serverErrors[fieldName]) return serverErrors[fieldName];
        if (!validation.isValid && value?.length >= 3) return validation.errorMessage;
        return '';
    };

    const getFieldStatus = () => {
        if (getFieldHelp()) return 'error';

        const antdErrors = form?.getFieldError(fieldName);
        if (antdErrors && antdErrors.length > 0) {
            return 'error';
        }

        if (serverErrors[fieldName]) return 'error';
        if (!validation.isValid && value?.length >= 3) return 'error';

        if (validation.isValid && value?.length >= 4 && !validation.checking) return 'success';

        return '';
    };

    const getFieldSuffix = () => {
        if (validation.checking) return 'loading';
        return null;
    };

    return {
        feedback: feedback.feedback,
        setFeedback: feedback.setFeedback,
        status: getFieldStatus(),
        help: getFieldHelp(),
        loading: validation.checking,
        tooltipVisible: tooltip.visible,
        openTooltip: tooltip.open,
        closeTooltip: tooltip.close,
        toggleTooltip: tooltip.toggle,
        handleChange,
        clearFeedback: feedback.clearFeedback,
        setServerError: validation.setServerError,
        clearServerError: validation.clearError,
        isValid: validation.isValid,
        suffix: getFieldSuffix(),
    };
};