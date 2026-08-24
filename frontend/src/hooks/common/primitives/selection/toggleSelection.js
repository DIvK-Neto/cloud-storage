export const toggleSelection = (key, currentSelected) => {
    if (currentSelected.includes(key)) {
        return currentSelected.filter(k => k !== key);
    } else {
        return [...currentSelected, key];
    }
};