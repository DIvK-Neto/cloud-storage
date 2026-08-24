// Экшен для добавления задачи
export const addTask = (task) => {
    return {
        type: 'ADD_TASK',
        payload: task,
    };
};