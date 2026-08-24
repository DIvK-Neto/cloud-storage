import React from 'react';
import { Card, Typography } from 'antd';
import './AdminPanel.css';

const { Title, Paragraph } = Typography;

export const AdminPanel = () => {
    return (
        <div className="admin-panel-container">
            <Card className="admin-panel-card">
                <Title level={2}>Панель администратора</Title>
                <Paragraph>
                    Здесь будет отображаться список пользователей, управление файлами и другие административные функции.
                </Paragraph>
                <Paragraph>
                    <em>Страница в разработке.</em>
                </Paragraph>
            </Card>
        </div>
    );
};