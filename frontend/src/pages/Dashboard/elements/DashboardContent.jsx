import React from 'react';
import { Card } from 'antd';
import { ActionPanel } from '../../../components/ui/ActionPanel/collections/actionPanel';
import { ProgressWidget } from '../../../components/ui/ProgressWidget/collections/progressWidget';
import { FileList } from './FileList';
import { Breadcrumbs } from './Breadcrumbs';

export const DashboardContent = ({
    items,
    path,
    navigateToFolder,
    // пропсы для таблицы (одиночные действия)
    onDelete,
    onRename,
    onMove,
    onDownload,
    onShare,
    onComment,
    onOpenUpload,
    onEditDescription,
    onManageLink,
    stats,
    statsLoading,
    // пропсы для выбора
    selectedRowKeys,
    onSelectChange,
    isAllSelected,
    onSelectAll,
    // пропсы для панели действий (массовые)
    selectedCount,
    panelDownload,
    panelShare,
    panelRename,
    panelMove,
    panelDelete,
    // === ДОБАВЛЕНЫ ДЛЯ ПОИСКА И ФИЛЬТРОВ ===
    isSearchActive,
    searchMode,
}) => {
    return (
        <>
            <Breadcrumbs path={path} onNavigate={navigateToFolder} />
            <ActionPanel
                selectedCount={selectedCount}
                onDownload={panelDownload}
                onShare={panelShare}
                onRename={panelRename}
                onMove={panelMove}
                onDelete={panelDelete}
            />
            <Card>
                <FileList
                    items={items}
                    onNavigate={navigateToFolder}
                    onDelete={onDelete}
                    onRename={onRename}
                    onMove={onMove}
                    onDownload={onDownload}
                    onShare={onShare}
                    onComment={onComment}
                    onOpenUpload={onOpenUpload}
                    onEditDescription={onEditDescription}
                    onManageLink={onManageLink}
                    stats={stats}
                    statsLoading={statsLoading}
                    selectedRowKeys={selectedRowKeys}
                    onSelectChange={onSelectChange}
                    isAllSelected={isAllSelected}
                    onSelectAll={onSelectAll}
                    // === ДОБАВЛЕНЫ ===
                    isSearchActive={isSearchActive}
                    searchMode={searchMode}
                />
            </Card>
            <ProgressWidget onNavigateToFolder={navigateToFolder} />
        </>
    );
};