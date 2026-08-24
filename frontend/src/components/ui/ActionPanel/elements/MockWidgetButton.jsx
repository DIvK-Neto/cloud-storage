import React from 'react';
import { Button } from 'antd';
import { BugOutlined } from '@ant-design/icons';

export const MockWidgetButton = ({ onClick }) => {
    return (
        <Button type="primary" ghost icon={<BugOutlined />} onClick={onClick}>
            Имитация виджета
        </Button>
    );
};