import React, { useState, useEffect } from 'react';
import { Spin, Typography, Modal, message } from 'antd';
import { useDashboardData } from './collections/hooks';
import { DashboardHeader, DashboardContent, DashboardModals } from './elements/all_elements';
import { useTrashCount } from './primitives/hooks/useTrashCount';
import { searchDashboard } from '../../api/all_api';
import { useSearchFilters } from '../../hooks/common/all_common';
import { useBulkDeleteModal } from './primitives/modal_hooks/useBulkDeleteModal';
import './Dashboard.css';

const { Title } = Typography;

export const Dashboard = () => {
    const {
        items,
        currentFolderId,
        loading,
        error,
        path,
        navigateToFolder,
        fetchItems,
        handleUpload,
        handleDownloadFile,
        handleCreateShareLink,
        handleUpdateComment,
        stats,
        statsLoading,
        uploadModal,
        createFolderModal,
        renameModal,
        moveModal,
        deleteModal,          // старый (одиночный)
        editDescriptionModal,
        shareModal,
        manageLinkModal,
        downloadModal,
        bulkMoveModal,
        bulkRenameModal,
        folders,
        selectedIds,
        selectedCount,
        setSelectedIds,
        isAllSelected,
        onSelectAll,
        setItems,
        refreshStats,
        removeItem,
    } = useDashboardData();

    const { count: trashCount } = useTrashCount();

    // --- Поиск и фильтры (уже есть) ---
    const [searchQuery, setSearchQuery] = useState('');
    const [searchStats, setSearchStats] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    const {
        searchMode,
        itemType,
        caseSensitive,
        matchMode,
        handleFilterChange,
        resetFilters,
        isFilterActive,
    } = useSearchFilters('current', 'all');

    // --- Массовое удаление ---
    const bulkDeleteModal = useBulkDeleteModal(
        fetchItems,
        currentFolderId,
        refreshStats,
        false, // modalKeepOnClose — пока false, можно позже подключить
        removeItem
    );

    // Обёртка для панели действий
    const bulkDeleteModalWithSelection = {
        ...bulkDeleteModal,
        handleDeleteSelection: () => {
            const selectedItems = items.filter(item =>
                selectedIds.includes(`${item.type}-${item.id}`)
            );
            if (selectedItems.length > 0) {
                // Предварительная проверка статусов (можно расширить)
                bulkDeleteModal.open(selectedItems);
            }
        },
    };

    // --- Поиск (уже есть) ---
    const performSearch = async (query, page = 1, pageSize = 20, ordering = 'name') => {
        if (query.trim() === '') {
            await fetchItems();
            setSearchStats(null);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);
        try {
            const response = await searchDashboard(
                currentFolderId,
                query,
                page,
                pageSize,
                ordering,
                {
                    searchMode,
                    caseSensitive,
                    matchMode,
                    itemType,
                }
            );
            setItems(response.data.results || []);
            if (response.data.stats) {
                setSearchStats(response.data.stats);
            }
        } catch (err) {
            console.error('Ошибка поиска на Dashboard:', err);
            message.error('Ошибка при поиске');
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearch = (value) => {
        setSearchQuery(value);
        if (value.trim() === '') {
            setSearchMode('current');
            setItemType('all');
            setCaseSensitive(false);
            setMatchMode('contains');
        }
        performSearch(value);
    };

    const handleFilterChangeWithSearch = (newFilters) => {
        handleFilterChange(newFilters);
        if (searchQuery.trim() !== '') {
            performSearch(searchQuery);
        }
    };

    useEffect(() => {
        if (searchQuery.trim() !== '') {
            performSearch(searchQuery);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchMode, itemType, caseSensitive, matchMode]);

    const displayStats = (searchQuery.trim() !== '' && searchStats) ? searchStats : stats;

    useEffect(() => {
        if (searchQuery.trim() !== '') {
            setSearchQuery('');
            setSearchStats(null);
            setSearchMode('current');
            setItemType('all');
            setCaseSensitive(false);
            setMatchMode('contains');
            fetchItems();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentFolderId]);

    const showPlaceholder = (action) => {
        Modal.info({
            title: 'Заглушка',
            content: `Нажата кнопка "${action}"`,
        });
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 40 }}>
                <Spin size="large" description="Загрузка..." />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: 40 }}>
                <Typography.Text type="danger">{error}</Typography.Text>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <DashboardHeader
                onCreateFolder={createFolderModal.open}
                onUpload={uploadModal.open}
                trashCount={trashCount}
                onSearch={handleSearch}
                onFilterChange={handleFilterChangeWithSearch}
                resetFilters={resetFilters}
                searchMode={searchMode}
                itemType={itemType}
                caseSensitive={caseSensitive}
                matchMode={matchMode}
                isSearchActive={searchQuery.trim() !== ''}
            />
            <DashboardContent
                items={items}
                path={path}
                navigateToFolder={navigateToFolder}
                onDelete={deleteModal.open}
                onRename={renameModal.open}
                onMove={moveModal.open}
                onDownload={handleDownloadFile}
                onShare={handleCreateShareLink}
                onComment={handleUpdateComment}
                onOpenUpload={uploadModal.open}
                onEditDescription={editDescriptionModal.open}
                onManageLink={manageLinkModal.open}
                stats={displayStats}
                statsLoading={statsLoading || isSearching}
                selectedRowKeys={selectedIds}
                onSelectChange={setSelectedIds}
                selectedCount={selectedCount}
                isAllSelected={isAllSelected}
                onSelectAll={onSelectAll}
                panelDownload={downloadModal.handleDownloadSelection}
                panelShare={shareModal.handleShareSelection}
                panelRename={bulkRenameModal.handleRenameSelection}
                panelMove={bulkMoveModal.handleMoveSelection}
                panelDelete={bulkDeleteModalWithSelection.handleDeleteSelection}
                isSearchActive={searchQuery.trim() !== ''}
                searchMode={searchMode}
            />
            <DashboardModals
                uploadModal={uploadModal}
                createFolderModal={createFolderModal}
                renameModal={renameModal}
                moveModal={moveModal}
                deleteModal={deleteModal}
                editDescriptionModal={editDescriptionModal}
                shareModal={shareModal}
                manageLinkModal={manageLinkModal}
                downloadModal={downloadModal}
                bulkMoveModal={bulkMoveModal}
                bulkRenameModal={bulkRenameModal}
                bulkDeleteModal={bulkDeleteModal}  // добавляем
                currentFolderId={currentFolderId}
                items={items}
                fetchItems={fetchItems}
                handleUpload={handleUpload}
                folders={folders}
            />
        </div>
    );
};