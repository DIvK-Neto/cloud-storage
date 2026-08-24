import { useState } from 'react';
import { toggleSelection, selectAll, clearSelection, isSelected, isAllSelected } from '../../../../hooks/common/collections/selection';

export const useDashboardSelection = () => {
    const [selectedIds, setSelectedIds] = useState([]);
    const selectedCount = selectedIds.length;

    const handleToggleSelection = (key) => {
        setSelectedIds(prev => toggleSelection(key, prev));
    };

    const handleSelectAll = (currentItems) => {
        setSelectedIds(selectAll(currentItems));
    };

    const handleClearSelection = () => {
        setSelectedIds(clearSelection());
    };

    const handleIsSelected = (key) => {
        return isSelected(key, selectedIds);
    };

    const handleIsAllSelected = (currentItems) => {
        return isAllSelected(currentItems, selectedIds);
    };

    return {
        selectedIds,
        selectedCount,
        setSelectedIds,
        toggleSelection: handleToggleSelection,
        selectAll: handleSelectAll,
        clearSelection: handleClearSelection,
        isSelected: handleIsSelected,
        isAllSelected: handleIsAllSelected,
    };
};