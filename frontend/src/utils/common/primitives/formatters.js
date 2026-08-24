/**
 * Форматирует размер файла в человекочитаемый вид
 * @param {number} bytes - размер в байтах
 * @returns {string} - например, "1.2 МБ" или "450 Б"
 */
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Б';

    const units = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    let size = bytes / Math.pow(k, i);
    let unitIndex = i;

    // Гибридная логика:
    // Если единица КБ и размер >= 102.4 (0.1 МБ), переключаем на МБ
    if (unitIndex === 1 && size >= 102.4) {
        unitIndex = 2;
        size = bytes / Math.pow(k, 2);
    }
    // Если единица МБ и размер < 0.1, переключаем на КБ
    if (unitIndex === 2 && size < 0.1) {
        unitIndex = 1;
        size = bytes / Math.pow(k, 1);
    }
    // Если единица ГБ и размер < 0.1 ГБ (102.4 МБ), переключаем на МБ
    if (unitIndex === 3 && size < 0.1) {
        unitIndex = 2;
        size = bytes / Math.pow(k, 2);
    }
    // Если единица ТБ и размер < 0.1 ТБ (102.4 ГБ), переключаем на ГБ
    if (unitIndex === 4 && size < 0.1) {
        unitIndex = 3;
        size = bytes / Math.pow(k, 3);
    }

    // Для байтов показываем целое число, для остальных — с одним знаком
    const formatted = unitIndex === 0 ? Math.round(size) : size.toFixed(1);
    return `${formatted} ${units[unitIndex]}`;
};

/**
 * Форматирует ISO-строку даты в локальный формат.
 * @param {string} isoString - дата в формате ISO (например, "2026-07-16T12:20:53.752065Z")
 * @returns {object} - { date: "2026-07-16", time: "12:20:53" }
 */
export const formatDateTime = (isoString) => {
    if (!isoString) return { date: '—', time: '—' };
    const dateObj = new Date(isoString);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');
    return {
        date: `${year}-${month}-${day}`,
        time: `${hours}:${minutes}:${seconds}`,
    };
};