/**
 * Проверить наличие дубликатов среди списка файлов в текущей папке.
 * @param {File[]} files - Массив загружаемых файлов (объекты File).
 * @param {Array} currentItems - Текущий список элементов в папке (массив объектов с полем name и type).
 * @returns {Object} Объект с полями:
 *   - duplicates: массив файлов, которые уже есть в папке (по имени).
 *   - unique: массив файлов, которых нет в папке.
 */
export const checkDuplicates = (files, currentItems) => {
    const existingNames = currentItems
        .filter((item) => item.type === 'file')
        .map((f) => f.name);

    const duplicates = [];
    const unique = [];

    files.forEach((file) => {
        if (existingNames.includes(file.name)) {
            duplicates.push(file);
        } else {
            unique.push(file);
        }
    });

    return { duplicates, unique };
};

/**
 * Сгенерировать новое имя для файла, добавляя суффикс _N, если имя занято.
 * @param {string} fileName - Оригинальное имя файла (с расширением).
 * @param {Array} currentItems - Текущий список элементов в папке.
 * @returns {string} Уникальное имя файла.
 */
export const generateUniqueFileName = (fileName, currentItems) => {
    const existingNames = currentItems
        .filter((item) => item.type === 'file')
        .map((f) => f.name);

    if (!existingNames.includes(fileName)) return fileName;

    const baseName = fileName.replace(/\.[^.]+$/, '');
    const ext = fileName.includes('.') ? '.' + fileName.split('.').pop() : '';
    let counter = 1;
    let newName = `${baseName}_${counter}${ext}`;
    while (existingNames.includes(newName)) {
        counter++;
        newName = `${baseName}_${counter}${ext}`;
    }
    return newName;
};