export const filterByDate = (items, fromDate, toDate) => {
    if (!items) return [];
    if (!fromDate && !toDate) return items;
    return items.filter(item => {
        if (!item.date) return false;
        const date = new Date(item.date);
        if (fromDate && date < new Date(fromDate)) return false;
        if (toDate && date > new Date(toDate)) return false;
        return true;
    });
};