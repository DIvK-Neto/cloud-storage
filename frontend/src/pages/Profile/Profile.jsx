import React from 'react';
import { Card, Typography } from 'antd';
import { useAuth } from '../../hooks/auth/collections/auth';
import './Profile.css';

const { Title, Paragraph } = Typography;

export const Profile = () => {
    const { user } = useAuth();

    return (
        <div className="profile-container">
            <Card className="profile-card">
                <Title level={2}>Личный кабинет</Title>
                <Paragraph>
                    <strong>Имя:</strong> {user?.full_name || 'Не указано'}
                </Paragraph>
                <Paragraph>
                    <strong>Логин:</strong> {user?.username}
                </Paragraph>
                <Paragraph>
                    <strong>Email:</strong> {user?.email}
                </Paragraph>
                <Paragraph>
                    <strong>Роль:</strong> {user?.is_admin ? 'Администратор' : 'Пользователь'}
                </Paragraph>
                <Paragraph>
                    <em>Здесь будут настройки профиля (смена пароля, загрузка аватара и т.д.)</em>
                </Paragraph>
            </Card>
        </div>
    );
};