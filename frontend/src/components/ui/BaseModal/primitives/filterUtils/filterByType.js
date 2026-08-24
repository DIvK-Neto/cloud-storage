export const filterByType = (items, type) => {
    if (!items) return [];
    if (!type) return items;
    return items.filter(item => item.type === type);
};