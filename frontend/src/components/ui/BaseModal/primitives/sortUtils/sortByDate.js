export const sortByDate = (items, order = 'asc') => {
    if (!items) return [];
    const sorted = [...items].sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateA - dateB;
    });
    return order === 'asc' ? sorted : sorted.reverse();
};