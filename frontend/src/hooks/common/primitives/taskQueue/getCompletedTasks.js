// Селектор: получить только успешно завершённые задачи (done)
export const getCompletedTasks = (tasks) => {
    return tasks.filter(task => task.status === 'done');
};