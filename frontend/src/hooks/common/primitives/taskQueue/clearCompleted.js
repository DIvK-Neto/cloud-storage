// Экшен для очистки завершённых задач (done и error)
export const clearCompleted = () => {
    return {
        type: 'CLEAR_COMPLETED',
    };
};