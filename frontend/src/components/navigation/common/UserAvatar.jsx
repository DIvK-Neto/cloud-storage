import React from 'react';
import { Avatar, Typography } from 'antd';
import { UserOutlined, CrownOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Text } = Typography;

export const UserAvatar = ({ user }) => {
    if (!user) return null;

    return (
        <Link to="/profile" className="navbar-link" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'white', textDecoration: 'none' }}>
            <Avatar icon={<UserOutlined />} size="small" />
            <Text style={{ color: 'white' }}>
                {user.full_name || user.username}
                {user.is_admin && <CrownOutlined style={{ marginLeft: '4px', color: 'gold' }} />}
            </Text>
        </Link>
    );
};