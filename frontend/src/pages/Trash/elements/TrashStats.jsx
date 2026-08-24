import React, { useState } from 'react';
import { Spin, Button, Tooltip } from 'antd';
import { formatFileSize } from '../../../utils/all_utils';

export const TrashStats = ({ stats, loading }) => {
    const [expanded, setExpanded] = useState(false);

    if (loading) {
        return (
            <tr className="trash-stats-row">
                <td colSpan={4} style={{ padding: '8px 16px' }}>
                    <Spin size="small" />
                </td>
            </tr>
        );
    }

    const {
        total_folders = 0,
        total_files = 0,
        total_size = 0,
        files_by_type = {},
    } = stats || {};

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
            <tr className="trash-stats-row">
                <td colSpan={4} style={{ padding: '8px 16px', fontWeight: 'normal' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        <Tooltip title="Общее количество папок в корзине">
                            <span>
                                <strong>Папок:</strong> {formatNumber(total_folders)}
                            </span>
                        </Tooltip>
                        <Tooltip title="Общее количество файлов в корзине">
                            <span>
                                <strong>Файлов:</strong> {formatNumber(total_files)}
                            </span>
                        </Tooltip>
                        <Tooltip title="Общий размер всех элементов в корзине">
                            <span>
                                <strong>Размер:</strong> {formatFileSize(total_size)}
                            </span>
                        </Tooltip>
                        {hasTypes && (
                            <Button
                                type="link"
                                size="small"
                                onClick={toggleExpanded}
                                style={{ padding: 0 }}
                            >
                                {expanded ? 'Скрыть' : 'Ещё'}
                            </Button>
                        )}
                    </div>
                </td>
            </tr>
            {expanded && hasTypes && (
                <tr className="trash-stats-detail-row">
                    <td colSpan={4} style={{ padding: '4px 16px 8px 16px', fontWeight: 'normal', fontSize: '0.9em' }}>
                        {Object.entries(typeLabels).map(([key, label]) => {
                            const count = files_by_type[key] || 0;
                            if (count === 0) return null;
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