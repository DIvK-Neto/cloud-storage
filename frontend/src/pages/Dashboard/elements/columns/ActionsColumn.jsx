import React from 'react';
import { FileActionsMenu } from '../FileActionsMenu';

export const ActionsColumn = ({
    onNavigate,
    onDelete,
    onRename,
    onMove,
    onDownload,
    onShare,
    onComment,
}) => ({
    title: 'Действия',
    key: 'actions',
    render: (_, record) => (
        <FileActionsMenu
            record={record}
            onNavigate={onNavigate}
            onDelete={onDelete}
            onRename={onRename}
            onMove={onMove}
            onDownload={onDownload}
            onShare={onShare}
            onComment={onComment}
        />
    ),
});