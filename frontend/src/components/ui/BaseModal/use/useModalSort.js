import { useMemo } from 'react';
import {
    sortByName,
    sortBySize,
    sortByDate,
    sortByStatus,
} from '../collections/sortUtils';

export const useModalSort = (items, sortKey, sortOrder) => {
    const sortedItems = useMemo(() => {
        if (!items) return [];
        if (!sortKey) return items;

        switch (sortKey) {
            case 'name':
                return sortByName(items, sortOrder);
            case 'size':
                return sortBySize(items, sortOrder);
            case 'date':
                return sortByDate(items, sortOrder);
            case 'status':
                return sortByStatus(items, sortOrder);
            default:
                return items;
        }
    }, [items, sortKey, sortOrder]);

    return sortedItems;
};