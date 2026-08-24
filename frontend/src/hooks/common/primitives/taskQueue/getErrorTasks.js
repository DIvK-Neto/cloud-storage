// Селектор: получить задачи с ошибками
export const getErrorTasks = (tasks) => {
    return tasks.filter(task => task.status === 'error');
};