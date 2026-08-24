import React from 'react';
import { Button, Tooltip } from 'antd';
import { PushpinOutlined } from '@ant-design/icons';

export const PinButton = ({ pinned, onToggle }) => {
    return (
        <Tooltip title={pinned ? 'Открепить панель' : 'Закрепить панель'}>
            <Button
                type="text"
                icon={<PushpinOutlined />}
                onClick={onToggle}
                style={{ color: pinned ? '#1890ff' : 'inherit' }}
            />
        </Tooltip>
    );
};