import { useDashboardSelection } from '../useDashboardSelection';

export const useDashboardDataSelection = (items, originalNavigateToFolder) => {
    const selection = useDashboardSelection();

    const handleSelectAll = () => selection.selectAll(items);
    const isAllSelected = selection.isAllSelected(items);

    const navigateToFolderWithClear = (folderId) => {
        selection.clearSelection();
        originalNavigateToFolder(folderId);
    };

    return {
        ...selection,
        handleSelectAll,
        isAllSelected,
        navigateToFolderWithClear,
    };
};