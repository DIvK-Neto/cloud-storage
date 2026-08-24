import api from '../../axios';

// Регистрация нового пользователя
export const register = (userData) => {
    return api.post('/register/', userData);
};

