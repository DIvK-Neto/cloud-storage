export const getStatusIcon = (status) => {
    const icons = {
        pending: '⏳',
        active: '⏳',
        done: '✅',
        error: '❌',
    };
    return icons[status] || '⏳';
};