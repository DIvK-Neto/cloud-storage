// Селектор: получить активные задачи (pending или active)
export const getActiveTasks = (tasks) => {
    return tasks.filter(task => task.status === 'pending' || task.status === 'active');
};