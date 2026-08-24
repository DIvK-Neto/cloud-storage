import React from 'react';
import { formatDateTime } from '../../../../utils/all_utils';

export const DateColumn = () => ({
    title: 'Дата загрузки',
    dataIndex: 'date',
    key: 'date',
    width: 150,
    render: (date) => {
        if (!date) return '—';
        const { date: formattedDate, time } = formatDateTime(date);
        return (
            <div>
                <div>Дата: {formattedDate}</div>
                <div>Время: {time}</div>
            </div>
        );
    },
    sorter: (a, b) => {
        // Папки всегда сверху
        if (a.type === 'folder' && b.type !== 'folder') return -1;
        if (a.type !== 'folder' && b.type === 'folder') return 1;
        // Оба одного типа — сортируем по дате
        const dateA = new Date(a.date || 0);
        const dateB = new Date(b.date || 0);
        return dateA - dateB;
    },
});