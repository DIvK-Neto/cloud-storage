import { useNavigation } from '../useNavigation';

export const useDashboardDataNavigation = () => {
    const {
        items,
        currentFolderId,
        loading,
        error,
        path,
        navigateToFolder: originalNavigateToFolder,
        fetchItems,
        setItems, // <-- ДОБАВЛЕНО
    } = useNavigation();

    return {
        items,
        currentFolderId,
        loading,
        error,
        path,
        originalNavigateToFolder,
        fetchItems,
        setItems, // <-- ДОБАВЛЕНО
    };
};