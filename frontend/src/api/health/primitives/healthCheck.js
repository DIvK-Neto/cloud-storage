import api from '../../axios';

// Проверка работоспособности бэкенда
export const healthCheck = () => {
    return api.get('/health/');
};

