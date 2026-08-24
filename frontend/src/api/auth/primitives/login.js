import api from '../../axios';

// Вход пользователя
export const login = (credentials) => {
    return api.post('/login/', credentials);
};

