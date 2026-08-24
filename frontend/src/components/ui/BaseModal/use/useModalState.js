import { useState } from 'react';
import { INITIAL_MODAL_STATE } from '../collections/initialState';

export const useModalState = () => {
    const [isOpen, setIsOpen] = useState(INITIAL_MODAL_STATE.isOpen);
    const [isFilterOn, setIsFilterOn] = useState(INITIAL_MODAL_STATE.isFilterOn);
    const [isLoading, setIsLoading] = useState(INITIAL_MODAL_STATE.isLoading);
    const [items, setItems] = useState(INITIAL_MODAL_STATE.items);
    const [selectedItems, setSelectedItems] = useState(INITIAL_MODAL_STATE.selectedItems);
    const [sortKey, setSortKey] = useState(INITIAL_MODAL_STATE.sortKey);
    const [sortOrder, setSortOrder] = useState(INITIAL_MODAL_STATE.sortOrder);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    const toggleFilter = () => setIsFilterOn(prev => !prev);
    const toggleSortOrder = () => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');

    return {
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
    };
};