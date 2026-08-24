export const selectAll = (items) => {
    if (!items || items.length === 0) return [];
    // Игнорируем элементы без type или id
    const validItems = items.filter(item => item && item.type && item.id);
    return validItems.map(item => `${item.type}-${item.id}`);
};