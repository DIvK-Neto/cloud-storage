import React from 'react';
import { Dropdown, Button } from 'antd';
import {
    FolderOpenOutlined,
    DownloadOutlined,
    ShareAltOutlined,
    EditOutlined,
    CommentOutlined,
    DeleteOutlined,
} from '@ant-design/icons';

export const FileActionsMenu = ({
    record,
    onNavigate,
    onDelete,
    onRename,
    onMove,
    onDownload,
    onShare,
    onComment,
}) => {
    const isFolder = record.type === 'folder';

    const handleAction = (action) => {
        switch (action) {
            case 'delete':
                onDelete(record);
                break;
            case 'rename':
                onRename(record);
                break;
            case 'move':
                onMove(record);
                break;
            case 'download':
                onDownload(record.id, record.name);
                break;
            case 'share':
                onShare(record.id);
                break;
            case 'comment':
                onComment(record.id, record.comment || '');
                break;
            default:
                break;
        }
    };

    const menuItems = [
        ...(isFolder
            ? [
                {
                    key: 'open',
                    icon: <FolderOpenOutlined />,
                    label: 'Открыть',
                    onClick: () => onNavigate(record.id),
                },
            ]
            : []),
        ...(!isFolder
            ? [
                {
                    key: 'download',
                    icon: <DownloadOutlined />,
                    label: 'Скачать',
                    onClick: () => handleAction('download'),
                },
                {
                    key: 'share',
                    icon: <ShareAltOutlined />,
                    label: 'Поделиться',
                    onClick: () => handleAction('share'),
                },
            ]
            : []),
        {
            key: 'rename',
            icon: <EditOutlined />,
            label: 'Переименовать',
            onClick: () => handleAction('rename'),
        },
        ...(!isFolder
            ? [
                {
                    key: 'comment',
                    icon: <CommentOutlined />,
                    label: 'Комментарий',
                    onClick: () => handleAction('comment'),
                },
            ]
            : []),
        {
            key: 'move',
            icon: <FolderOpenOutlined />,
            label: 'Переместить',
            onClick: () => handleAction('move'),
        },
        {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: 'Удалить',
            danger: true,
            onClick: () => handleAction('delete'),
        },
    ];

    return (
        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
            <Button type="text">...</Button>
        </Dropdown>
    );
};