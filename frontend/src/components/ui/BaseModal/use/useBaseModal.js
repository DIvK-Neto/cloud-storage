import { useModalState } from './useModalState';
import { useModalFilter } from './useModalFilter';
import { useModalSort } from './useModalSort';

export const useBaseModal = () => {
    const {
        isOpen,
        isFilterOn,
        isLoading,
        items,
        selectedItems,
        sortKey,
        sortOrder,
        openModal,
        closeModal,
        toggleFilter,
        setIsLoading,
        setItems,
        setSelectedItems,
        setSortKey,
        toggleSortOrder,
    } = useModalState();

    const {
        filteredItems,
        searchQuery,
        setSearchQuery,
        filterType,
        setFilterType,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
    } = useModalFilter(items, isFilterOn);

    const sortedItems = useModalSort(filteredItems, sortKey, sortOrder);

    return {
        // Состояния
        isOpen,
        isFilterOn,
        isLoading,
        items,           // исходные
        filteredItems,   // после фильтров
        sortedItems,     // после сортировки
        selectedItems,
        sortKey,
        sortOrder,
        searchQuery,
        filterType,
        dateFrom,
        dateTo,

        // Методы управления модалкой
        openModal,
        closeModal,
        toggleFilter,
        setIsLoading,
        setItems,
        setSelectedItems,
        setSortKey,
        toggleSortOrder,

        // Методы фильтрации
        setSearchQuery,
        setFilterType,
        setDateFrom,
        setDateTo,
    };
};