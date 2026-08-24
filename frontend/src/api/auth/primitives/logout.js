import api from '../../axios';

// Выход пользователя
export const logout = () => {
    return api.post('/logout/');
};

