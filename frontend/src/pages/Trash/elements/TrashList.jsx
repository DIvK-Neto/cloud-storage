import React, { useState } from 'react';
import { Table, Checkbox, Tooltip, Select, Pagination, Space, Button } from 'antd';
import {
    FolderOutlined,
    FileOutlined,
    LinkOutlined,
    EditOutlined,
    CommentOutlined,
} from '@ant-design/icons';
import { formatFileSize } from '../../../utils/all_utils';
import { formatDateTime } from '../../../utils/all_utils';
import { useSettings } from '../../../hooks/common/use/useSettings';
import { TrashStats } from './TrashStats';

const PAGE_SIZE_OPTIONS = [
    { value: 10, label: '10' },
    { value: 25, label: '25' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: 0, label: 'Все' },
];

export const TrashList = ({
    items,
    onSelectChange,
    selectedRowKeys,
    isAllSelected,
    onSelectAll,
    totalItems,
    currentPage,
    onPageChange,
    onOrderingChange,
    ordering,
    onManageLink,
    onEditDescription,
    onViewComments,
    stats,
    statsLoading,
}) => {
    const { dashboardPageSize, setDashboardPageSize } = useSettings();

    const pageSize = dashboardPageSize === 0 ? totalItems : dashboardPageSize;
    const showPagination = dashboardPageSize !== 0;

    const components = {
        body: {
            wrapper: (props) => {
                const { children, ...restProps } = props;
                const statsRow = <TrashStats stats={stats} loading={statsLoading} />;
                return (
                    <tbody {...restProps}>
                        {statsRow}
                        {children}
                    </tbody>
                );
            },
        },
    };

    const columns = [
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            render: (text, record) => (
                <Tooltip title={text}>
                    <Space>
                        {record.type === 'folder' ? (
                            <FolderOutlined style={{ color: '#faad14' }} />
                        ) : (
                            <FileOutlined style={{ color: '#1890ff' }} />
                        )}
                        <span style={{ wordBreak: 'break-all' }}>{text}</span>
                    </Space>
                </Tooltip>
            ),
            sorter: (a, b) => a.name.localeCompare(b.name),
            sortOrder: ordering === 'name' ? 'ascend' : ordering === '-name' ? 'descend' : null,
        },
        {
            title: 'Тип',
            dataIndex: 'type',
            key: 'type',
            width: 100,
            render: (type) => (type === 'folder' ? 'Папка' : 'Файл'),
        },
        {
            title: 'Размер',
            dataIndex: 'size',
            key: 'size',
            width: 120,
            render: (size) => formatFileSize(size) || '—',
            sorter: (a, b) => (a.size || 0) - (b.size || 0),
            sortOrder: ordering === 'size' ? 'ascend' : ordering === '-size' ? 'descend' : null,
        },
        {
            title: 'Дата удаления',
            dataIndex: 'deleted_at',
            key: 'deleted_at',
            width: 150,
            render: (date) => {
                if (!date) return '—';
                const formatted = formatDateTime(date);
                if (!formatted || !formatted.date) return '—';
                return (
                    <div>
                        <div>{formatted.date}</div>
                        <div>{formatted.time}</div>
                    </div>
                );
            },
            sorter: (a, b) => new Date(a.deleted_at) - new Date(b.deleted_at),
            sortOrder: ordering === 'deleted_at' ? 'ascend' : ordering === '-deleted_at' ? 'descend' : null,
        },
        {
            title: <Tooltip title="Ссылки">🔗</Tooltip>,
            key: 'link',
            width: 60,
            align: 'center',
            render: (_, record) => {
                const hasLink = record.has_share_link === true;
                return (
                    <Tooltip title={hasLink ? 'Просмотреть ссылки' : 'Нет ссылок'}>
                        <Button
                            type="text"
                            icon={<LinkOutlined style={{ color: hasLink ? '#1890ff' : '#d9d9d9' }} />}
                            onClick={() => hasLink && onManageLink && onManageLink(record)}
                            disabled={!hasLink}
                        />
                    </Tooltip>
                );
            },
        },
        {
            title: <Tooltip title="Описание">✏️</Tooltip>,
            key: 'description',
            width: 60,
            align: 'center',
            render: (_, record) => {
                const hasDesc = record.comment || record.description;
                return (
                    <Tooltip title={hasDesc ? 'Просмотреть описание' : 'Нет описания'}>
                        <Button
                            type="text"
                            icon={<EditOutlined style={{ color: hasDesc ? '#1890ff' : '#d9d9d9' }} />}
                            onClick={() => hasDesc && onEditDescription && onEditDescription(record)}
                            disabled={!hasDesc}
                        />
                    </Tooltip>
                );
            },
        },
        {
            title: <Tooltip title="Комментарии">💬</Tooltip>,
            key: 'comments',
            width: 60,
            align: 'center',
            render: (_, record) => {
                const count = record.comments_count || 0;
                return (
                    <Tooltip title={count > 0 ? `Комментариев: ${count}` : 'Нет комментариев'}>
                        <Button
                            type="text"
                            icon={<CommentOutlined style={{ color: count > 0 ? '#1890ff' : '#d9d9d9' }} />}
                            onClick={() => count > 0 && onViewComments && onViewComments(record)}
                            disabled={count === 0}
                        />
                    </Tooltip>
                );
            },
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (keys) => {
            onSelectChange(keys);
        },
        columnTitle: (
            <Tooltip title="Выбрать все">
                <Checkbox
                    checked={isAllSelected}
                    onChange={(e) => {
                        if (e.target.checked) {
                            onSelectAll(items);
                        } else {
                            onSelectChange([]);
                        }
                    }}
                />
            </Tooltip>
        ),
        columnWidth: 40,
    };

    const handlePageChange = (page) => {
        onPageChange(page);
    };

    const handleTableChange = (pagination, filters, sorter) => {
        if (sorter && sorter.field) {
            const order = sorter.order === 'ascend' ? sorter.field : `-${sorter.field}`;
            let orderingParam = order;
            if (sorter.field === 'name') {
                orderingParam = order;
            } else if (sorter.field === 'size') {
                orderingParam = order;
            } else if (sorter.field === 'deleted_at') {
                orderingParam = order;
            }
            onOrderingChange(orderingParam);
        }
    };

    return (
        <div>
            <Table
                dataSource={items}
                columns={columns}
                rowKey={record => `${record.type}-${record.id}`}
                pagination={false}
                locale={{ emptyText: 'Корзина пуста' }}
                rowSelection={rowSelection}
                components={components}
                onChange={handleTableChange}
            />
            <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
                {showPagination ? (
                    <Pagination
                        current={currentPage}
                        total={totalItems}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                        showTotal={(total, range) => `${range[0]}-${range[1]} из ${total} элементов`}
                    />
                ) : (
                    <span>Всего элементов: {totalItems}</span>
                )}
                <Space>
                    <span>Показывать:</span>
                    <Select
                        value={dashboardPageSize}
                        onChange={(value) => setDashboardPageSize(value)}
                        options={PAGE_SIZE_OPTIONS}
                        style={{ width: 80 }}
                    />
                </Space>
            </div>
        </div>
    );
};