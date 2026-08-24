export const formatTaskTime = (seconds) => {
    if (seconds < 60) return `${Math.round(seconds)} сек`;
    const minutes = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${minutes} мин ${secs} сек`;
};