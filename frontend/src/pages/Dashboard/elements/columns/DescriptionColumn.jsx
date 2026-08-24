import React from 'react';
import { Tooltip } from 'antd';

export const DescriptionColumn = ({ onEditDescription }) => ({
    title: <Tooltip title="Описание">📝</Tooltip>,
    key: 'description',
    width: 160,
    align: 'center',
    render: (_, record) => {
        const fullDesc = record.comment || record.description || '';
        const hasDescription = fullDesc.length > 0;

        // Обрезаем до 30 символов
        const displayText = fullDesc.length > 30 ? fullDesc.slice(0, 30) + '…' : fullDesc;

        const handleClick = (e) => {
            e.stopPropagation();
            if (onEditDescription) {
                onEditDescription(record);
            }
        };

        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    cursor: 'pointer',
                    justifyContent: hasDescription ? 'flex-start' : 'center',
                    overflow: 'hidden',
                    width: '100%',
                }}
                onClick={handleClick}
            >
                <Tooltip title={hasDescription ? 'Редактировать описание' : 'Добавить описание'}>
                    <span
                        style={{
                            fontSize: 16,
                            color: hasDescription ? '#1890ff' : '#d9d9d9',
                            flexShrink: 0,
                        }}
                    >
                        {hasDescription ? '✏️' : '📝'}
                    </span>
                </Tooltip>
                {hasDescription && (
                    <Tooltip title={fullDesc}>
                        <span
                            style={{
                                fontSize: 13,
                                wordBreak: 'break-word',       // перенос длинных слов
                                overflow: 'hidden',
                                maxWidth: '100%',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,            // максимум 2 строки (чтобы не вылезало)
                                WebkitBoxOrient: 'vertical',
                            }}
                        >
                            {displayText}
                        </span>
                    </Tooltip>
                )}
            </div>
        );
    },
});