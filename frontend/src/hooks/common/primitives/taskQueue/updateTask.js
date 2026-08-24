// Экшен для обновления задачи (прогресс, статус)
export const updateTask = (id, data) => {
    return {
        type: 'UPDATE_TASK',
        payload: { id, data },
    };
};