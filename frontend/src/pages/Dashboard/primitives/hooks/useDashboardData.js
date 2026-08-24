import { useCallback, useContext } from 'react';
import { SettingsContext } from '../../../../context/SettingsContext';
import api from '../../../../api/axios';
import { useDashboardDataNavigation } from './useDashboardData/useDashboardDataNavigation';
import { useDashboardDataFiles } from './useDashboardData/useDashboardDataFiles';
import { useDashboardDataFolders } from './useDashboardData/useDashboardDataFolders';
import { useStats } from './useStats';
import { useDashboardDataSelection } from './useDashboardData/useDashboardDataSelection';
import { useDashboardDataModals } from './useDashboardData/useDashboardDataModals';
import { useBulkMoveModal } from '../modal_hooks/useBulkMoveModal';
import { useBulkRenameModal } from '../modal_hooks/useBulkRenameModal'; // <-- добавлен импорт

const sortItems = (a, b) => {
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
};

export const useDashboardData = () => {
    const { modalKeepOnClose } = useContext(SettingsContext);

    const navigation = useDashboardDataNavigation();
    const { items, currentFolderId, fetchItems, setItems, originalNavigateToFolder } = navigation;

    const updateItem = useCallback((updatedItem) => {
        if (!updatedItem || !updatedItem.id || !updatedItem.type) {
            console.warn('updateItem: некорректный объект', updatedItem);
            return;
        }
        setItems(prev => {
            const mapped = prev.map(item =>
                item.id === updatedItem.id && item.type === updatedItem.type
                    ? { ...item, ...updatedItem }
                    : item
            );
            return mapped.sort(sortItems);
        });
    }, [setItems]);

    const removeItem = useCallback((id, type) => {
        if (!id || !type) return;
        setItems(prev => prev.filter(item => !(item.id === id && item.type === type)));
    }, [setItems]);

    const addItem = useCallback((newItem) => {
        if (!newItem || !newItem.id || !newItem.type) {
            console.warn('addItem: попытка добавить некорректный объект', newItem);
            return;
        }
        setItems(prev => {
            const updated = [...prev, newItem];
            return updated.sort(sortItems);
        });
    }, [setItems]);

    const { stats, refreshStats } = useStats(currentFolderId, items);

    const files = useDashboardDataFiles(
        currentFolderId,
        fetchItems,
        items,
        updateItem,
        removeItem,
        addItem,
        refreshStats
    );
    const folders = useDashboardDataFolders(
        currentFolderId,
        fetchItems,
        items,
        updateItem,
        removeItem,
        addItem,
        refreshStats
    );
    const selection = useDashboardDataSelection(items, originalNavigateToFolder);

    const handleCreateShareLinks = useCallback(
        async ({ items: selectedItems, linkType, expiresAt, allowDownload, passwordView, passwordDownload }) => {
            const results = [];

            if (linkType === 'individual') {
                for (const item of selectedItems) {
                    try {
                        const options = {
                            linkType: allowDownload ? 'download' : 'view',
                            expiresAt: expiresAt,
                            allowComments: false,
                            passwordView: passwordView || null,
                            passwordDownload: passwordDownload || null,
                        };
                        const link = await files.handleCreateShareLink({
                            id: item.id,
                            type: item.type,
                            options,
                        });
                        if (item && item.id && item.type) {
                            updateItem({ ...item, has_share_link: true });
                        }
                        results.push({
                            id: item.id,
                            name: item.name,
                            type: item.type,
                            status: 'success',
                            link: link,
                        });
                    } catch (error) {
                        const errorMsg = error.response?.data?.detail || error.response?.data?.error || 'Неизвестная ошибка';
                        results.push({
                            id: item.id,
                            name: item.name,
                            type: item.type,
                            status: 'error',
                            link: null,
                            errorMessage: errorMsg,
                        });
                    }
                }
                return results;
            }

            if (linkType === 'common') {
                try {
                    const ids = selectedItems.map(item => item.id);
                    const payload = {
                        items: ids,
                        name: 'Коллекция',
                        expires_at: expiresAt,
                        allow_comments: false,
                        allow_download: allowDownload,
                        password_view: passwordView || null,
                        password_download: passwordDownload || null,
                    };
                    const response = await api.post('/share/create-collection/', payload);
                    const collectionLink = response.data.uuid;
                    const fullUrl = `${window.location.origin}/shared/collection/${collectionLink}`;

                    selectedItems.forEach(item => {
                        if (item && item.id && item.type) {
                            updateItem({ ...item, has_share_link: true });
                        }
                    });

                    results.push({
                        id: 'collection',
                        name: 'Общая ссылка',
                        type: 'collection',
                        status: 'success',
                        link: fullUrl,
                    });
                    return results;
                } catch (error) {
                    const msg = error.response?.data?.detail || error.response?.data?.error || 'Ошибка создания общей ссылки';
                    results.push({
                        id: 'collection',
                        name: 'Общая ссылка',
                        type: 'collection',
                        status: 'error',
                        link: null,
                        errorMessage: msg,
                    });
                    return results;
                }
            }

            return [];
        },
        [files.handleCreateShareLink, updateItem]
    );

    const modals = useDashboardDataModals(
        files.handleCreateFolder,
        currentFolderId,
        files.handleRenameItem,
        files.handleMoveItem,
        files.handleDeleteItem,
        files.handleUpdateComment,
        handleCreateShareLinks,
        updateItem,
        removeItem,
        addItem,
        refreshStats,
        fetchItems,
        modalKeepOnClose
    );

    const bulkMoveModal = useBulkMoveModal(
        fetchItems,
        currentFolderId,
        refreshStats,
        modalKeepOnClose,
        removeItem
    );

    const bulkMoveModalWithSelection = {
        ...bulkMoveModal,
        handleMoveSelection: () => {
            const selectedItems = items.filter(item =>
                selection.selectedIds.includes(`${item.type}-${item.id}`)
            );
            if (selectedItems.length > 0) {
                bulkMoveModal.open(selectedItems);
            }
        },
    };

    // ========== НОВОЕ: useBulkRenameModal ==========
    const bulkRenameModal = useBulkRenameModal(
        fetchItems,
        currentFolderId,
        refreshStats,
        modalKeepOnClose,
        updateItem,
        addItem,
        removeItem
    );

    const bulkRenameModalWithSelection = {
        ...bulkRenameModal,
        handleRenameSelection: () => {
            const selectedItems = items.filter(item =>
                selection.selectedIds.includes(`${item.type}-${item.id}`)
            );
            if (selectedItems.length > 0) {
                bulkRenameModal.open(selectedItems);
            }
        },
    };

    const shareModalWithSelection = {
        ...modals.shareModal,
        handleShareSelection: () => {
            const selectedItems = items.filter(item =>
                selection.selectedIds.includes(`${item.type}-${item.id}`)
            );
            if (selectedItems.length > 0) {
                modals.shareModal.open(selectedItems);
            }
        },
    };

    const downloadModalWithSelection = {
        ...modals.downloadModal,
        handleDownloadSelection: () => {
            const selectedItems = items.filter(item =>
                selection.selectedIds.includes(`${item.type}-${item.id}`)
            );
            if (selectedItems.length > 0) {
                modals.downloadModal.open(selectedItems);
            }
        },
    };

    // Используем оригинальную функцию навигации, а не обёртку selection
    const navigateToFolder = originalNavigateToFolder;

    return {
        ...navigation,
        ...files,
        ...folders,
        stats,
        refreshStats,
        ...selection,
        ...modals,
        shareModal: shareModalWithSelection,
        downloadModal: downloadModalWithSelection,
        bulkMoveModal: bulkMoveModalWithSelection,
        bulkRenameModal: bulkRenameModalWithSelection, // <-- добавлено
        navigateToFolder,
        onSelectAll: selection.handleSelectAll,
        isAllSelected: selection.isAllSelected,
        folders: items.filter(item => item && item.type === 'folder'),
        updateItem,
        removeItem,
        addItem,
    };
};