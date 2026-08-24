export const loginValidator = [
    { required: true, message: 'Введите логин' },
    { min: 3, message: 'Минимум 3 символа' },
    { max: 20, message: 'Не более 20 символов' },
];

