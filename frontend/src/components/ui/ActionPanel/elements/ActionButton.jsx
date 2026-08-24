import React from 'react';
import { Button, Tooltip } from 'antd';
import { WarningOutlined } from '@ant-design/icons';

export const ActionButton = ({ icon, tooltip, onClick, hasUnfinished = false, disabled = false }) => {
    return (
        <Tooltip title={hasUnfinished ? 'Есть незавершённое действие. Нажмите, чтобы продолжить' : tooltip}>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: hasUnfinished ? '2px solid #ff4d4f' : 'none',
                    borderRadius: '6px',
                    padding: '2px 6px',
                    transition: 'border-color 0.2s',
                    margin: '0 2px',
                    opacity: disabled ? 0.5 : 1,
                }}
            >
                <Button type="text" icon={icon} onClick={onClick} disabled={disabled} />
                {hasUnfinished && <WarningOutlined style={{ color: '#ff4d4f', fontSize: '16px', marginLeft: 4 }} />}
            </div>
        </Tooltip>
    );
};