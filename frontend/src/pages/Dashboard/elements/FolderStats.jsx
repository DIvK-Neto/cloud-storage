import React, { useState } from 'react';
import { Spin, Button, Tooltip } from 'antd';
import { formatFileSize } from '../../../utils/all_utils';

export const FolderStats = ({ stats, loading, selectedCount = 0 }) => {
    const [expanded, setExpanded] = useState(false);

    if (loading) {
        return (
            <tr className="folder-stats-row">
                <td colSpan={4} style={{ padding: '8px 16px' }}>
                    <Spin size="small" />
                </td>
            </tr>
        );
    }

    const {
        current_folders = 0,
        current_files = 0,
        current_size = 0,
        total_folders = 0,
        total_files = 0,
        total_size = 0,
        files_by_type = {},
    } = stats;

    const toggleExpanded = () => setExpanded(prev => !prev);

    const formatNumber = (num) => (num || 0).toLocaleString('ru-RU');

    const typeLabels = {
        images: 'Изображений',
        documents: 'Документов',
        videos: 'Видео',
        audio: 'Аудио',
        archives: 'Архивов',
        other: 'Других',
    };

    const hasTypes = files_by_type && Object.values(files_by_type).some(v => v > 0);

    return (
        <>
            <tr className="folder-stats-row">
                <td colSpan={4} style={{ padding: '8px 16px', fontWeight: 'normal' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {/* Текущая строка с тултипом */}
                        <Tooltip title="Показывает элементы, которые находятся непосредственно в этой папке (без учёта вложенных папок).">
                            <div>
                                <span style={{ fontWeight: 'bold' }}>Текущая:</span>
                                <span style={{ marginLeft: 8 }}>Папок {formatNumber(current_folders)}</span>
                                <span style={{ marginLeft: 12 }}>Файлов {formatNumber(current_files)}</span>
                                <span style={{ marginLeft: 12 }}>Размер {formatFileSize(current_size || 0)}</span>
                            </div>
                        </Tooltip>
                        {/* Всего строка с тултипом */}
                        <Tooltip title="Показывает все элементы внутри этой папки, включая вложенные папки и файлы во всех подпапках.">
                            <div>
                                <span style={{ fontWeight: 'bold' }}>Всего:</span>
                                <span style={{ marginLeft: 8 }}>Папок {formatNumber(total_folders)}</span>
                                <span style={{ marginLeft: 12 }}>Файлов {formatNumber(total_files)}</span>
                                <span style={{ marginLeft: 12 }}>Размер {formatFileSize(total_size || 0)}</span>
                                {hasTypes && (
                                    <Button
                                        type="link"
                                        size="small"
                                        onClick={toggleExpanded}
                                        style={{ padding: 0, marginLeft: 12 }}
                                    >
                                        {expanded ? 'Скрыть' : 'Ещё'}
                                    </Button>
                                )}
                            </div>
                        </Tooltip>
                    </div>
                </td>
            </tr>
            {expanded && hasTypes && (
                <tr className="folder-stats-detail-row">
                    <td colSpan={4} style={{ padding: '4px 16px 8px 16px', fontWeight: 'normal', fontSize: '0.9em' }}>
                        {Object.entries(typeLabels).map(([key, label]) => {
                            const count = files_by_type[key] || 0;
                            return (
                                <span key={key} style={{ marginRight: 16 }}>
                                    {label}: {formatNumber(count)}
                                </span>
                            );
                        })}
                    </td>
                </tr>
            )}
        </>
    );
};