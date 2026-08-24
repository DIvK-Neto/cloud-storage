export const filterByStatus = (items) => {
    if (!items) return [];
    return items.filter(item => item.status === 'warning' || item.status === 'error');
};