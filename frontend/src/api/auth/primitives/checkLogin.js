import api from '../../axios';

export const checkLogin = (login) => {
    return api.get('/check-login/', { params: { login } });
};

