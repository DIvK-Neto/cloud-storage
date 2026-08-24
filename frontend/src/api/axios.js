import axios from 'axios';

// Создаём экземпляр Axios с предустановленными настройками
const api = axios.create({
    // Базовый URL для всех запросов — указываем адрес бэкенда
    baseURL: 'http://localhost:8000/api/',
    // Отправлять cookies вместе с запросами (нужно для сессий)
    withCredentials: true,
    // Указываем, что ожидаем JSON-ответы
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;

