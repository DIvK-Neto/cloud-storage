export const usernameValidator = [
    { required: true, message: 'Введите логин' },
    { min: 4, message: 'Минимум 4 символа' },
    { max: 20, message: 'Не более 20 символов' },
    { pattern: /^[A-Za-z][A-Za-z0-9]*$/, message: 'Логин должен начинаться с буквы и содержать только латинские буквы и цифры' },
];