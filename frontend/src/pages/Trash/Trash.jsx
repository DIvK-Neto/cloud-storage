import React, { useState, useEffect } from 'react';
import { Spin, Typography, message } from 'antd';
import { useTrashData } from './primitives/hooks/useTrashData';
import { TrashHeader } from './elements/TrashHeader';
import { TrashBackButton } from './elements/TrashBackButton';
import { TrashContent } from './elements/TrashContent';
import { searchTrash } from '../../api/all_api';
import { useSearchFilters } from '../../hooks/common/all_common';
import './Trash.css';

const { Title } = Typography;

export const Trash = () => {
    const {
        items,
        loading,
        error,
        currentPage,
        totalItems,
        ordering,
        selectedIds,
        setSelectedIds,
        selectedCount,
        trashCount,
        dashboardPageSize,
        handlePageChange,
        handleOrderingChange,
        handleClearTrash,
        stats,
        statsLoading,
        setStats,
        onManageLink,
        onEditDescription,
        onViewComments,
        setItems,
        fetchTrashList,
        itemType: hookItemType,
        setItemType,
        restoreSelected,           // <-- добавлено
        permanentDeleteSelected,   // <-- добавлено
        handleSelectAll,           // <-- добавлено
        handleClearSelection,      // <-- добавлено
        isAllSelected,             // <-- добавлено
    } = useTrashData();

    // Используем общий хук для фильтров (без searchMode)
    const {
        itemType,
        caseSensitive,
        matchMode,
        handleFilterChange,
        resetFilters,
        isFilterActive,
    } = useSearchFilters('current', hookItemType || 'all');

    // Синхронизация itemType с хуком useTrashData
    useEffect(() => {
        if (setItemType && itemType !== hookItemType) {
            setItemType(itemType);
        }
    }, [itemType, hookItemType, setItemType]);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchTotalItems, setSearchTotalItems] = useState(totalItems);
    const [searchCurrentPage, setSearchCurrentPage] = useState(1);
    const [isSearching, setIsSearching] = useState(false);

    const pageSize = dashboardPageSize === 0 ? totalItems : dashboardPageSize;

    // Первичная загрузка
    useEffect(() => {
        fetchTrashList();
    }, []);

    // Обновление при изменении параметров (кроме поиска)
    useEffect(() => {
        if (searchQuery.trim() === '') {
            fetchTrashList();
        }
    }, [dashboardPageSize, ordering, itemType]);

    const handleSearch = async (value) => {
        setSearchQuery(value);
        setSearchCurrentPage(1);
        setIsSearching(true);

        if (value.trim() === '') {
            await fetchTrashList();
            setSearchTotalItems(totalItems);
            setIsSearching(false);
            return;
        }

        try {
            const response = await searchTrash(value, 1, pageSize, ordering, itemType);
            setItems(response.data.results || []);
            setSearchTotalItems(response.data.count || 0);
            if (response.data.stats) {
                setStats(response.data.stats);
            }
        } catch (err) {
            console.error('Ошибка поиска:', err);
            message.error('Ошибка при поиске');
            setSearchTotalItems(0);
        } finally {
            setIsSearching(false);
        }
    };

    const handlePageChangeWithSearch = async (page) => {
        if (isSearching) return;

        if (searchQuery.trim() === '') {
            const normalPageSize = dashboardPageSize === 0 ? totalItems : dashboardPageSize;
            const maxPage = normalPageSize > 0 ? Math.max(1, Math.ceil(totalItems / normalPageSize)) : 1;
            let targetPage = page;
            if (page > maxPage) {
                targetPage = maxPage;
                message.warning(`Страница ${page} не найдена, переход на страницу ${targetPage}`);
            }
            handlePageChange(targetPage);
            return;
        }

        const maxPage = Math.max(1, Math.ceil(searchTotalItems / pageSize));
        let targetPage = page;
        if (page > maxPage) {
            targetPage = maxPage;
            message.warning(`Страница ${page} не найдена, переход на страницу ${targetPage}`);
        }

        setSearchCurrentPage(targetPage);

        try {
            const response = await searchTrash(searchQuery, targetPage, pageSize, ordering, itemType);
            setItems(response.data.results || []);
            setSearchTotalItems(response.data.count || 0);
            if (response.data.stats) {
                setStats(response.data.stats);
            }
        } catch (err) {
            console.error('Ошибка пагинации с поиском:', err);
            message.error('Ошибка при загрузке страницы');
        }
    };

    const handleOrderingChangeWithSearch = async (newOrder) => {
        if (searchQuery.trim() === '') {
            handleOrderingChange(newOrder);
            return;
        }
        try {
            const response = await searchTrash(searchQuery, 1, pageSize, newOrder, itemType);
            setItems(response.data.results || []);
            setSearchTotalItems(response.data.count || 0);
            setSearchCurrentPage(1);
            if (response.data.stats) {
                setStats(response.data.stats);
            }
        } catch (err) {
            console.error('Ошибка сортировки с поиском:', err);
            message.error('Ошибка при сортировке');
        }
    };

    // Обработчик изменения фильтров
    const handleFilterChangeWithSearch = (newFilters) => {
        handleFilterChange(newFilters);
        if (searchQuery.trim() !== '') {
            performSearchWithFilters(searchQuery);
        }
    };

    const performSearchWithFilters = async (query) => {
        setIsSearching(true);
        try {
            const response = await searchTrash(query, 1, pageSize, ordering, itemType);
            setItems(response.data.results || []);
            setSearchTotalItems(response.data.count || 0);
            if (response.data.stats) {
                setStats(response.data.stats);
            }
        } catch (err) {
            console.error('Ошибка поиска с фильтрами:', err);
            message.error('Ошибка при поиске');
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        if (searchQuery.trim() !== '' && !isSearching) {
            performSearchWithFilters(searchQuery);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemType, caseSensitive, matchMode]);

    const handleResetFilters = () => {
        resetFilters();
        if (searchQuery.trim() !== '') {
            performSearchWithFilters(searchQuery);
        }
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

    const displayTotalItems = searchQuery.trim() !== '' ? searchTotalItems : totalItems;
    const displayCurrentPage = searchQuery.trim() !== '' ? searchCurrentPage : currentPage;

    return (
        <div className="trash-container">
            <TrashHeader
                onSearch={handleSearch}
                onClearTrash={handleClearTrash}
                trashCount={trashCount}
                onFilterChange={handleFilterChangeWithSearch}
                resetFilters={handleResetFilters}
                itemType={itemType}
                caseSensitive={caseSensitive}
                matchMode={matchMode}
                isSearchActive={searchQuery.trim() !== '' || isFilterActive()}
            />
            <TrashBackButton />
            <TrashContent
                items={items}
                loading={loading}
                error={error}
                totalItems={displayTotalItems}
                currentPage={displayCurrentPage}
                onPageChange={handlePageChangeWithSearch}
                selectedCount={selectedCount}
                onRestore={restoreSelected}
                onPermanentDelete={permanentDeleteSelected}
                selectedIds={selectedIds}
                onSelectChange={setSelectedIds}
                isAllSelected={isAllSelected(items)}
                onSelectAll={handleSelectAll}
                onOrderingChange={handleOrderingChangeWithSearch}
                ordering={ordering}
                stats={stats}
                statsLoading={statsLoading}
                onManageLink={onManageLink}
                onEditDescription={onEditDescription}
                onViewComments={onViewComments}
            />
        </div>
    );
};