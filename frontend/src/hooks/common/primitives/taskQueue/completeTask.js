// Экшен для завершения задачи (успех или ошибка)
export const completeTask = (id, status, error = null) => {
    return {
        type: 'COMPLETE_TASK',
        payload: { id, status, error },
    };
};