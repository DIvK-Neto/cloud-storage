import React from 'react';
import { DownloadOutlined, ShareAltOutlined, EditOutlined, FolderOpenOutlined, DeleteOutlined } from '@ant-design/icons';
import { ActionButton } from './ActionButton';

export const ActionButtons = ({
    onDownload,
    onShare,
    onRename,
    onMove,          // ← теперь это реальная функция (вызовет bulkMoveModal.open)
    onDelete,
    unfinishedKeys = [],
    hasAnyUnfinished = false,
}) => {
    const buttons = [
        { key: 'download', icon: <DownloadOutlined />, tooltip: 'Скачать', onClick: onDownload },
        { key: 'share', icon: <ShareAltOutlined />, tooltip: 'Поделиться', onClick: onShare },
        { key: 'rename', icon: <EditOutlined />, tooltip: 'Переименовать', onClick: onRename },
        { key: 'move', icon: <FolderOpenOutlined />, tooltip: 'Переместить', onClick: onMove },
        { key: 'delete', icon: <DeleteOutlined />, tooltip: 'Удалить', onClick: onDelete },
    ];

    return (
        <>
            {buttons.map(btn => {
                const hasUnfinished = unfinishedKeys.includes(btn.key);
                return (
                    <ActionButton
                        key={btn.key}
                        icon={btn.icon}
                        tooltip={btn.tooltip}
                        onClick={btn.onClick}
                        hasUnfinished={hasUnfinished}
                        disabled={hasAnyUnfinished && !hasUnfinished}
                    />
                );
            })}
        </>
    );
};