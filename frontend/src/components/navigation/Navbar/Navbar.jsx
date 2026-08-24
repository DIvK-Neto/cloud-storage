import React from 'react';
import { Layout } from 'antd';
import { useNavbar } from './collections/navbar';
import { Logo } from '../common/Logo';
import { UserAvatar } from '../common/UserAvatar';
import { MenuItems } from '../common/MenuItems';
import './Navbar.css';

const { Header } = Layout;

export const Navbar = () => {
    const { isAuthenticated, user, menuItems, handleMenuClick } = useNavbar();

    return (
        <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#001529' }}>
            <Logo />
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                {isAuthenticated && <UserAvatar user={user} />}
                <MenuItems items={menuItems} onItemClick={handleMenuClick} />
            </div>
        </Header>
    );
};