import { useCallback } from 'react';
import { message } from 'antd';
import { uploadFile } from '../../../../api/all_api';
import { useUploadProgress } from './useUploadProgress';
import { checkDuplicates, generateUniqueFileName } from '../../../../utils/all_utils';

/**
 * Хук для загрузки файлов (один и группа) с прогрессом и проверкой дубликатов.
 * @param {number|null} currentFolderId - ID текущей папки.
 * @param {Function} fetchItems - Функция обновления списка (оставлена для совместимости, но не используется).
 * @param {Array} items - Текущий список элементов для проверки дубликатов.
 * @param {Function} addItem - Функция добавления элемента в локальный список.
 * @param {Function} refreshStats - Функция обновления статистики (опционально).
 * @returns {Object} Функции handleUpload и handleUploadMultiple.
 */
export const useUpload = (currentFolderId, fetchItems, items, addItem, refreshStats) => {
    const { setProgress, clearProgress } = useUploadProgress();

    // Загрузка одного файла
    const handleUpload = useCallback(
        async (file, comment = '', folderId = null) => {
            const targetFolder = folderId ?? currentFolderId;
            try {
                const res = await uploadFile(file, comment, targetFolder, (percent) => {
                    setProgress(file.name, percent);
                });
                message.success(`Файл "${file.name}" загружен`);
                // Добавляем новый файл в локальный список
                if (addItem && res.data) {
                    // Приводим к нормализованному виду, как в useNavigation
                    const newItem = {
                        ...res.data,
                        type: 'file',
                        name: res.data.original_name,
                        size: res.data.size,
                        date: res.data.upload_date,
                    };
                    addItem(newItem);
                }
                // Обновляем статистику, если функция передана
                if (refreshStats) {
                    await refreshStats();
                }
                return res;
            } catch (err) {
                const msg = err.response?.data?.detail || 'Ошибка загрузки файла';
                message.error(msg);
                throw err;
            } finally {
                clearProgress(file.name);
            }
        },
        [currentFolderId, addItem, refreshStats, setProgress, clearProgress]
    );

    // Групповая загрузка файлов (параллельно)
    const handleUploadMultiple = useCallback(
        async (files, comment = '', folderId = null) => {
            const targetFolder = folderId ?? currentFolderId;
            const { duplicates, unique } = checkDuplicates(files, items);

            if (duplicates.length > 0) {
                // TODO: показать модалку выбора действия (заменить / сохранить как)
                // Пока просто предупреждаем и загружаем уникальные
                message.warning(
                    `Найдено ${duplicates.length} дубликатов. Они будут пропущены.`
                );
            }

            // Загружаем уникальные файлы (каждый добавляется через addItem в handleUpload)
            const uploads = unique.map((file) =>
                handleUpload(file, comment, targetFolder)
            );
            await Promise.allSettled(uploads);
        },
        [items, handleUpload]
    );

    return {
        handleUpload,
        handleUploadMultiple,
    };
};