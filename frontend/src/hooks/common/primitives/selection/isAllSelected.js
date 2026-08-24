export const isAllSelected = (items, selectedIds) => {
    if (!items || items.length === 0) return false;
    // Игнорируем элементы без type или id
    const validItems = items.filter(item => item && item.type && item.id);
    if (validItems.length === 0) return false;
    const allKeys = validItems.map(item => `${item.type}-${item.id}`);
    return allKeys.every(key => selectedIds.includes(key));
};