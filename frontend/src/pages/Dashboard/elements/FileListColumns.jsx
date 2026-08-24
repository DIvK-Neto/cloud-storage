import React from 'react';
import { NameColumn } from './columns/NameColumn';
import { SizeColumn } from './columns/SizeColumn';
import { DateColumn } from './columns/DateColumn';
import { LinkColumn } from './columns/LinkColumn';
import { DescriptionColumn } from './columns/DescriptionColumn';
import { CommentsColumn } from './columns/CommentsColumn';
import { ActionsColumn } from './columns/ActionsColumn';

export const useFileListColumns = ({
    onNavigate,
    onDelete,
    onRename,
    onMove,
    onDownload,
    onShare,
    onComment,
    onOpenUpload,
    onEditDescription,
    onManageLink, // <-- ДОБАВЛЕНО
}) => {
    return [
        NameColumn({ onNavigate }),
        SizeColumn(),
        DateColumn(),
        LinkColumn({ onManageLink }), // <-- ИЗМЕНЕНО
        DescriptionColumn({ onEditDescription }),
        CommentsColumn(),
        ActionsColumn({ onNavigate, onDelete, onRename, onMove, onDownload, onShare, onComment }),
    ];
};