import React from 'react';
import { Dropdown, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';

export const MenuItems = ({ items, onItemClick }) => {
    const menuItems = items.map(item => ({
        key: item.path,
        label: item.label,
        onClick: () => onItemClick(item.path),
    }));

    return (
        <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
            <Button style={{ background: 'transparent', border: 'none', color: 'white' }}>
                <MenuOutlined style={{ fontSize: '20px', marginRight: '8px' }} />
                Меню
            </Button>
        </Dropdown>
    );
};