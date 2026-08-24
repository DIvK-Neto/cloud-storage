import React from 'react';
import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';

export const LogoutButton = ({ onClick }) => {
    return (
        <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={onClick}
            style={{ color: 'white' }}
        >
            Выйти
        </Button>
    );
};