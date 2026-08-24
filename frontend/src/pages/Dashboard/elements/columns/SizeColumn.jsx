import React from 'react';
import { formatFileSize } from '../../../../utils/all_utils';

export const SizeColumn = () => ({
    title: 'Размер',
    dataIndex: 'size',
    key: 'size',
    width: 150,
    align: 'left',
    render: (size, record) => {
        if (record.type === 'folder') {
            const folders = record.total_folders_count || 0;
            const files = record.total_files_count || 0;
            const totalSize = record.total_size || 0;
            return (
                <div>
                    <div>Папок: {folders}</div>
                    <div>Файлов: {files}</div>
                    <div>Размер: {formatFileSize(totalSize)}</div>
                </div>
            );
        }
        return formatFileSize(size);
    },
    sorter: (a, b) => {
        // Папки всегда сверху
        if (a.type === 'folder' && b.type !== 'folder') return -1;
        if (a.type !== 'folder' && b.type === 'folder') return 1;
        // Оба одного типа — сортируем по размеру
        return (a.size || 0) - (b.size || 0);
    },
});