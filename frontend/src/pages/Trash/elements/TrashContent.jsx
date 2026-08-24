import React from 'react';
import { Card } from 'antd';
import { ReloadOutlined, DeleteOutlined } from '@ant-design/icons';
import { ActionPanel } from '../../../components/ui/ActionPanel/collections/actionPanel';
import { ActionButton } from '../../../components/ui/ActionPanel/elements/ActionButton';
import { TrashList } from './TrashList';

export const TrashContent = ({
    items,
    loading,
    error,
    totalItems,
    currentPage,
    onPageChange,
    selectedCount,
    onRestore,
    onPermanentDelete,
    selectedIds,
    onSelectChange,
    isAllSelected,
    onSelectAll,
    onOrderingChange,
    ordering,
    stats,
    statsLoading,
    onManageLink,
    onEditDescription,
    onViewComments,
}) => {
    if (loading) {
        return <div style={{ textAlign: 'center', padding: 40 }}>Загрузка...</div>;
    }

    if (error) {
        return <div style={{ textAlign: 'center', padding: 40, color: 'red' }}>{error}</div>;
    }

    const customButtons = (
        <>
            <ActionButton
                key="restore"
                icon={<ReloadOutlined />}
                tooltip="Восстановить"
                onClick={onRestore}
                disabled={selectedCount === 0}
            />
            <ActionButton
                key="delete"
                icon={<DeleteOutlined />}
                tooltip="Удалить окончательно"
                onClick={onPermanentDelete}
                danger
                disabled={selectedCount === 0}
            />
        </>
    );

    return (
        <>
            <ActionPanel
                selectedCount={selectedCount}
                customButtons={customButtons}
            />
            <Card>
                <TrashList
                    items={items}
                    onSelectChange={onSelectChange}
                    selectedRowKeys={selectedIds}
                    isAllSelected={isAllSelected}
                    onSelectAll={onSelectAll}
                    totalItems={totalItems}
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                    onOrderingChange={onOrderingChange}
                    ordering={ordering}
                    onManageLink={onManageLink}
                    onEditDescription={onEditDescription}
                    onViewComments={onViewComments}
                    stats={stats}
                    statsLoading={statsLoading}
                />
            </Card>
        </>
    );
};