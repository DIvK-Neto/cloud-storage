export const sortByStatus = (items, order = 'asc') => {
    if (!items) return [];
    const priority = {
        error: 0,
        warning: 1,
        success: 2,
        pending: 3,
    };
    const sorted = [...items].sort((a, b) => {
        const statusA = a.status || 'pending';
        const statusB = b.status || 'pending';
        return (priority[statusA] ?? 3) - (priority[statusB] ?? 3);
    });
    return order === 'asc' ? sorted : sorted.reverse();
};