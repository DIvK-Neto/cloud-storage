export const getTaskStatusText = (task) => {
    const statuses = {
        pending: 'Ожидание...',
        active: 'Выполняется...',
        done: 'Готово',
        error: 'Ошибка',   // ← всегда только "Ошибка", без текста ошибки
    };
    return statuses[task.status] || '—';
};