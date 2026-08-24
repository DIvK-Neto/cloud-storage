import api from '../../axios';

export const checkDeleteStatus = (items) => {
    return api.post('/status/check-delete/', { items });
};