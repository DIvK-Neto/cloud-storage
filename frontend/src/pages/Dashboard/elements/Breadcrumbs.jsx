import React from 'react';
import { Breadcrumb } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

export const Breadcrumbs = ({ path, onNavigate }) => {
    const items = [
        {
            title: (
                <Link to="/" onClick={(e) => { e.preventDefault(); onNavigate(null); }}>
                    <HomeOutlined />
                </Link>
            ),
            key: 'root',
        },
        ...path.map((folder) => ({
            title: (
                <Link
                    to="#"
                    onClick={(e) => { e.preventDefault(); onNavigate(folder.id); }}
                >
                    {folder.name}
                </Link>
            ),
            key: folder.id,
        })),
    ];

    return <Breadcrumb items={items} style={{ marginBottom: 16 }} />;
};