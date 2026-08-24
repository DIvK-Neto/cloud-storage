export const fullNameValidator = [
    {
        required: true,
        message: 'Пожалуйста, введите полное имя!',
    },
    {
        min: 2,
        message: 'Имя должно содержать минимум 2 символа.',
    },
    {
        max: 50,
        message: 'Имя не может быть длиннее 50 символов.',
    },
];