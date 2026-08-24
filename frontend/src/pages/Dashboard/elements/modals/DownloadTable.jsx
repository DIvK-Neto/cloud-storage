import React, { useState } from 'react';
import { Table, Button, Input, Popover, Tooltip, Space, message } from 'antd';
import {
    FileOutlined,
    FolderOutlined,
    EditOutlined,
    DeleteOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    FolderOpenOutlined,
} from '@ant-design/icons';
import { formatFileSize } from '../../../../utils/common/primitives/formatters';

export const DownloadTable = ({
    items = [],
    onRemoveItem,
    onRenameItem,
    formatType,
    saveFolder = '',
}) => {
    const [editingItem, setEditingItem] = useState(null);
    const [newName, setNewName] = useState('');

    const getStatusIcon = (status) => {
        switch (status) {
            case 'success':
                return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
            case 'error':
                return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
            case 'pending':
            default:
                return <ClockCircleOutlined style={{ color: '#faad14' }} />;
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'success':
                return 'Готово';
            case 'error':
                return 'Ошибка';
            case 'pending':
            default:
                return 'Ожидание';
        }
    };

    const handleRename = (item) => {
        setEditingItem(item);
        setNewName(item.name);
    };

    const handleRenameConfirm = (item) => {
        if (newName.trim() && newName !== item.name) {
            onRenameItem(item, newName.trim());
        }
        setEditingItem(null);
        setNewName('');
    };

    const handleOpenFolder = (item) => {
        let url;
        if (item.type === 'file') {
            url = `/api/files/${item.id}/download/`;
        } else if (item.type === 'folder') {
            url = `/api/folders/${item.id}/download-folder/`;
        } else {
            return;
        }
        window.open(url, '_blank');
    };

    const columns = [
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <Space>
                    {record.type === 'folder' ? (
                        <FolderOutlined style={{ color: '#faad14' }} />
                    ) : (
                        <FileOutlined style={{ color: '#1890ff' }} />
                    )}
                    <span>{text}</span>
                </Space>
            ),
        },
        {
            title: 'Размер',
            dataIndex: 'size',
            key: 'size',
            render: (text) => formatFileSize(text) || '—',
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Space>
                    {getStatusIcon(status)}
                    <span>{getStatusText(status)}</span>
                </Space>
            ),
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_, record) => {
                const isSuccess = record.status === 'success';
                return (
                    <Space>
                        {formatType === 'individual' && record.status === 'pending' && (
                            <Tooltip title="Переименовать">
                                <Button
                                    type="text"
                                    icon={<EditOutlined />}
                                    onClick={() => handleRename(record)}
                                />
                            </Tooltip>
                        )}
                        {isSuccess && (
                            <Tooltip title="Скачать снова">
                                <Button
                                    type="text"
                                    icon={<FolderOpenOutlined />}
                                    onClick={() => handleOpenFolder(record)}
                                />
                            </Tooltip>
                        )}
                        {!isSuccess && (
                            <Tooltip title="Удалить из списка">
                                <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => onRemoveItem(record)}
                                />
                            </Tooltip>
                        )}
                    </Space>
                );
            },
        },
    ];

    const renamePopover = editingItem && (
        <Popover
            open={!!editingItem}
            content={
                <div>
                    <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onPressEnter={() => handleRenameConfirm(editingItem)}
                        autoFocus
                    />
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => handleRenameConfirm(editingItem)}
                        style={{ marginTop: 8 }}
                    >
                        Сохранить
                    </Button>
                </div>
            }
            trigger="click"
            onOpenChange={(open) => {
                if (!open) {
                    setEditingItem(null);
                    setNewName('');
                }
            }}
        >
            <div />
        </Popover>
    );

    return (
        <>
            {renamePopover}
            <Table
                dataSource={items}
                columns={columns}
                rowKey={(record) => `${record.type}-${record.id}`}
                pagination={false}
                size="small"
                bordered
            />
        </>
    );
};