import React from 'react';
import { Tooltip } from 'antd';

export const LinkColumn = ({ onManageLink }) => ({
    title: <Tooltip title="Ссылка">🔗</Tooltip>,
    key: 'share_link',
    align: 'center',
    render: (_, record) => {
        const hasLink = record.has_share_link === true;

        if (!hasLink) {
            return null;
        }

        return (
            <Tooltip title="Есть ссылка">
                <span
                    style={{
                        cursor: 'pointer',
                        fontSize: 18,
                        color: '#1890ff',
                        fontWeight: 'bold',
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onManageLink) {
                            onManageLink(record);
                        }
                    }}
                >
                    🔗
                </span>
            </Tooltip>
        );
    },
});