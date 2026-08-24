import React from 'react';
import { Tooltip, message } from 'antd';

export const CommentsColumn = () => ({
    title: <Tooltip title="Комментарии">💬</Tooltip>,
    key: 'comments',
    align: 'center', // <-- ДОБАВЛЕНО
    render: (_, record) => {
        const count = record.comments_count || 0;
        return (
            <Tooltip title={count > 0 ? `Комментариев: ${count}` : 'Нет комментариев'}>
                <span
                    style={{ cursor: 'pointer', fontSize: 18, color: count > 0 ? '#1890ff' : '#d9d9d9' }}
                    onClick={(e) => {
                        e.stopPropagation();
                        message.info('Заглушка: комментарии');
                    }}
                >
                    💬 {count > 0 && <span style={{ fontSize: 12 }}>{count}</span>}
                </span>
            </Tooltip>
        );
    },
});