export const filterByName = (items, query) => {
    if (!items) return [];
    if (!query) return items;
    const lowerQuery = query.toLowerCase();
    return items.filter(item => item.name && item.name.toLowerCase().includes(lowerQuery));
};