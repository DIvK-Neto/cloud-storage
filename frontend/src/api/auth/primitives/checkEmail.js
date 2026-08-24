import api from '../../axios';

export const checkEmail = (email) => {
    return api.get('/check-email/', { params: { email } });
};

