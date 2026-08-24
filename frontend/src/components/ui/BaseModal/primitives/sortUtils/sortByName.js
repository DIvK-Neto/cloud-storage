export const sortByName = (items, order = 'asc') => {
    if (!items) return [];
    const sorted = [...items].sort((a, b) => {
        const nameA = a.name || '';
        const nameB = b.name || '';
        return nameA.localeCompare(nameB);
    });
    return order === 'asc' ? sorted : sorted.reverse();
};