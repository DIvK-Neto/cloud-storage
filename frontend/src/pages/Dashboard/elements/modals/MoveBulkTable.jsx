import React, { useMemo } from 'react';
import { Table, Button, Popover, Input, Select, Space, Checkbox, Tooltip } from 'antd';
import {
    FolderOutlined,
    FileOutlined,
    EditOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    ClockCircleOutlined,
} from '@ant-design/icons';

const getStatusIcon = (status) => {
    switch (status) {
        case 'success':
            return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
        case 'error':
            return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
        case 'skipped':
            return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
        case 'pending':
        default:
            return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
    }
};

const getStatusText = (status) => {
    switch (status) {
        case 'success':
            return 'Готово';
        case 'error':
            return 'Ошибка';
        case 'skipped':
            return 'Исключён';
        case 'pending':
        default:
            return 'Ожидание';
    }
};

export const MoveBulkTable = ({
    items,
    statuses = {},
    onRemoveItem,
    onUpdateItem,
    showOnlyProblems,
    setShowOnlyProblems,
    targetFolderPath = '',
    conflictRule = 'rename',
    prefix = 'Копия_',
    suffix = '',
    applyToAll = true,
    individualOverrides = {},
    isComplete = false,
}) => {
    const getFuturePath = (item) => {
        const basePath = targetFolderPath ? `${targetFolderPath}/` : '/';
        const override = individualOverrides[item.id];

        let newName = override?.newName || item.name;

        if (!override || !override.newName) {
            if (conflictRule === 'rename' && applyToAll) {
                if (prefix && !newName.startsWith(prefix)) {
                    newName = prefix + newName;
                }
                if (suffix) {
                    const lastDotIndex = newName.lastIndexOf('.');
                    if (lastDotIndex > 0) {
                        const base = newName.substring(0, lastDotIndex);
                        const ext = newName.substring(lastDotIndex);
                        newName = base + suffix + ext;
                    } else {
                        newName = newName + suffix;
                    }
                }
            }
        } else {
            if (override.rule === 'rename') {
                if (prefix && !newName.startsWith(prefix)) {
                    newName = prefix + newName;
                }
                if (suffix) {
                    const lastDotIndex = newName.lastIndexOf('.');
                    if (lastDotIndex > 0) {
                        const base = newName.substring(0, lastDotIndex);
                        const ext = newName.substring(lastDotIndex);
                        newName = base + suffix + ext;
                    } else {
                        newName = newName + suffix;
                    }
                }
            }
        }
        return `${basePath}${newName}`;
    };

    const filteredItems = useMemo(() => {
        if (!showOnlyProblems) return items;
        return items.filter(item => {
            const status = statuses[item.id] || 'pending';
            return status === 'error' || status === 'skipped';
        });
    }, [items, statuses, showOnlyProblems]);

    const columns = [
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            render: (name, record) => (
                <Tooltip title={name}>
                    <Space>
                        {record.type === 'folder' ? (
                            <FolderOutlined style={{ color: '#faad14' }} />
                        ) : (
                            <FileOutlined style={{ color: '#1890ff' }} />
                        )}
                        <span style={{ wordBreak: 'break-all' }}>{name}</span>
                    </Space>
                </Tooltip>
            ),
        },
        {
            title: 'Размер',
            dataIndex: 'size',
            key: 'size',
            width: 100,
            render: (size) => size ? `${(size / 1024 / 1024).toFixed(2)} МБ` : '—',
        },
        {
            title: 'Текущий путь',
            dataIndex: 'path',
            key: 'path',
            width: '20%',
            render: (path) => (
                <Tooltip title={path || '/'}>
                    <span style={{ wordBreak: 'break-all' }}>{path || '/'}</span>
                </Tooltip>
            ),
        },
        {
            title: 'Будущий путь',
            key: 'futurePath',
            width: '20%',
            render: (_, record) => {
                const futurePath = getFuturePath(record);
                return (
                    <Tooltip title={futurePath}>
                        <span style={{ wordBreak: 'break-all' }}>{futurePath}</span>
                    </Tooltip>
                );
            },
        },
        {
            title: 'Статус',
            key: 'status',
            width: 120,
            render: (_, record) => {
                const status = statuses[record.id] || 'pending';
                return (
                    <Space>
                        {getStatusIcon(status)}
                        <span>{getStatusText(status)}</span>
                    </Space>
                );
            },
        },
        {
            title: 'Действия',
            key: 'actions',
            width: 140,
            render: (_, record) => {
                const status = statuses[record.id] || 'pending';
                const isProcessing = status === 'success' || status === 'error' || status === 'skipped';
                const disabled = isComplete || isProcessing;
                return (
                    <Space>
                        <Popover
                            trigger="click"
                            content={
                                <div style={{ width: 250 }}>
                                    <div style={{ marginBottom: 8 }}>
                                        <Input
                                            placeholder="Новое имя"
                                            defaultValue={record.name}
                                            onChange={(e) => {
                                                const newName = e.target.value;
                                                onUpdateItem(record, newName, undefined);
                                            }}
                                            disabled={disabled}
                                        />
                                    </div>
                                    <div>
                                        <Select
                                            defaultValue={individualOverrides[record.id]?.rule || conflictRule}
                                            style={{ width: '100%' }}
                                            onChange={(value) => {
                                                onUpdateItem(record, undefined, value);
                                            }}
                                            disabled={disabled}
                                        >
                                            <Select.Option value="replace">Заменить</Select.Option>
                                            <Select.Option value="rename">Добавить префикс/суффикс</Select.Option>
                                            <Select.Option value="skip">Исключить</Select.Option>
                                        </Select>
                                    </div>
                                </div>
                            }
                            title="Редактировать"
                        >
                            <Button
                                type="text"
                                icon={<EditOutlined />}
                                disabled={disabled}
                                size="small"
                            />
                        </Popover>
                        <Button
                            type="text"
                            icon={<DeleteOutlined />}
                            onClick={() => onRemoveItem(record)}
                            disabled={disabled}
                            size="small"
                            danger
                        />
                    </Space>
                );
            },
        },
    ];

    return (
        <div>
            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                <Checkbox
                    checked={showOnlyProblems}
                    onChange={(e) => setShowOnlyProblems(e.target.checked)}
                    disabled={isComplete}
                >
                    Показать только проблемные
                </Checkbox>
                <span>Всего: {items.length}</span>
            </div>
            <Table
                dataSource={filteredItems}
                columns={columns}
                rowKey={(record) => `${record.id}-${record.type}`}
                pagination={false}
                size="small"
            />
        </div>
    );
};