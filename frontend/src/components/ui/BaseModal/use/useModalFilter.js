import { useState, useMemo } from 'react';
import {
    filterByStatus,
    filterByName,
    filterByType,
    filterByDate,
} from '../collections/filterUtils';

export const useModalFilter = (items, isFilterOn) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState(null);
    const [dateFrom, setDateFrom] = useState(null);
    const [dateTo, setDateTo] = useState(null);

    const filteredItems = useMemo(() => {
        if (!items) return [];
        let result = items;

        // Фильтр по статусу (проблемные) – применяется только если isFilterOn === true
        if (isFilterOn) {
            result = filterByStatus(result);
        }

        // Поиск по имени
        if (searchQuery.trim()) {
            result = filterByName(result, searchQuery);
        }

        // Фильтр по типу
        if (filterType) {
            result = filterByType(result, filterType);
        }

        // Фильтр по дате
        if (dateFrom || dateTo) {
            result = filterByDate(result, dateFrom, dateTo);
        }

        return result;
    }, [items, isFilterOn, searchQuery, filterType, dateFrom, dateTo]);

    return {
        filteredItems,
        searchQuery,
        setSearchQuery,
        filterType,
        setFilterType,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
    };
};