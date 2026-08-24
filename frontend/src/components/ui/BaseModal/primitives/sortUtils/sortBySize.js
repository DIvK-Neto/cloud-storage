export const sortBySize = (items, order = 'asc') => {
    if (!items) return [];
    const sorted = [...items].sort((a, b) => (a.size || 0) - (b.size || 0));
    return order === 'asc' ? sorted : sorted.reverse();
};