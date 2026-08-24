import React, { useState } from 'react';
import { Table, Checkbox, Tooltip, Select, Pagination, Space } from 'antd';
import { useFileListColumns } from './FileListColumns';
import { FolderStats } from './FolderStats';
import { useSettings } from '../../../hooks/common/use/useSettings';

const PAGE_SIZE_OPTIONS = [
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: 0, label: 'Все' },
];

export const FileList = ({
    items,
    onNavigate,
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
    selectedRowKeys,
    onSelectChange,
    isAllSelected,
    onSelectAll,
    isSearchActive,
    searchMode,
}) => {
    const { dashboardPageSize, setDashboardPageSize } = useSettings();
    const [currentPage, setCurrentPage] = useState(1);

    // Базовые колонки
    let columns = useFileListColumns({
        onNavigate,
        onDelete,
        onRename,
        onMove,
        onDownload,
        onShare,
        onComment,
        onOpenUpload,
        onEditDescription,
        onManageLink,
    });

    // Если поиск активен и режим 'all' — добавляем колонку «Путь»
    if (isSearchActive && searchMode === 'all') {
        // Находим индекс колонки "Имя" и вставляем после неё колонку "Путь"
        const nameIndex = columns.findIndex(col => col.key === 'name' || col.dataIndex === 'name');
        const pathColumn = {
            title: 'Путь',
            dataIndex: 'path',
            key: 'path',
            width: '20%',
            render: (text) => (
                <Tooltip title={text}>
                    <span style={{ wordBreak: 'break-all' }}>{text || '/'}</span>
                </Tooltip>
            ),
        };
        if (nameIndex !== -1) {
            columns = [...columns.slice(0, nameIndex + 1), pathColumn, ...columns.slice(nameIndex + 1)];
        } else {
            columns = [pathColumn, ...columns];
        }
    }

    // Настройки выделения строк
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        columnTitle: (
            <Tooltip title="Выбрать все">
                <Checkbox
                    checked={isAllSelected}
                    onChange={(e) => {
                        if (e.target.checked) {
                            onSelectAll();
                        } else {
                            onSelectChange([]);
                        }
                    }}
                />
            </Tooltip>
        ),
        columnWidth: 40,
    };

    // Кастомный компонент для тела таблицы
    const components = {
        body: {
            wrapper: (props) => {
                const { children, ...restProps } = props;
                const statsRow = <FolderStats stats={stats} loading={statsLoading} selectedCount={selectedRowKeys?.length || 0} />;
                return (
                    <tbody {...restProps}>
                        {statsRow}
                        {children}
                    </tbody>
                );
            },
        },
    };

    const total = items.length;
    const pageSize = dashboardPageSize === 0 ? total : dashboardPageSize;
    const showPagination = dashboardPageSize !== 0;

    // Вычисляем текущие элементы для отображения
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);
    const currentItems = showPagination ? items.slice(startIndex, endIndex) : items;

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSizeChange = (value) => {
        setDashboardPageSize(value);
        setCurrentPage(1);
    };

    return (
        <div>
            <Table
                dataSource={currentItems}
                columns={columns}
                rowKey={record => `${record.type}-${record.id}`}
                pagination={false}
                locale={{ emptyText: 'Папка пуста. Загрузите файлы или создайте папку.' }}
                components={components}
                rowSelection={rowSelection}
            />
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                {showPagination ? (
                    <Pagination
                        current={currentPage}
                        total={total}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                        showTotal={(total, range) => `${range[0]}-${range[1]} из ${total} элементов`}
                    />
                ) : (
                    <span>Всего элементов: {total}</span>
                )}
                <Space>
                    <span>Показывать:</span>
                    <Select
                        value={dashboardPageSize}
                        onChange={handleSizeChange}
                        options={PAGE_SIZE_OPTIONS}
                        style={{ width: 80 }}
                    />
                </Space>
            </div>
        </div>
    );
};