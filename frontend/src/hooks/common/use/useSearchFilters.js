import { useState, useCallback } from 'react';

export const useSearchFilters = (initialSearchMode = 'current', initialItemType = 'all') => {
    const [searchMode, setSearchMode] = useState(initialSearchMode);
    const [itemType, setItemType] = useState(initialItemType);
    const [caseSensitive, setCaseSensitive] = useState(false);
    const [matchMode, setMatchMode] = useState('contains');

    const handleFilterChange = useCallback((newFilters) => {
        if (newFilters.searchMode !== undefined) setSearchMode(newFilters.searchMode);
        if (newFilters.itemType !== undefined) setItemType(newFilters.itemType);
        if (newFilters.caseSensitive !== undefined) setCaseSensitive(newFilters.caseSensitive);
        if (newFilters.matchMode !== undefined) setMatchMode(newFilters.matchMode);
    }, []);

    const resetFilters = useCallback(() => {
        setSearchMode(initialSearchMode);
        setItemType(initialItemType);
        setCaseSensitive(false);
        setMatchMode('contains');
    }, [initialSearchMode, initialItemType]);

    const isFilterActive = useCallback(() => {
        return searchMode !== initialSearchMode ||
            itemType !== initialItemType ||
            caseSensitive !== false ||
            matchMode !== 'contains';
    }, [searchMode, initialSearchMode, itemType, initialItemType, caseSensitive, matchMode]);

    return {
        searchMode,
        itemType,
        caseSensitive,
        matchMode,
        handleFilterChange,
        resetFilters,
        isFilterActive,
    };
};