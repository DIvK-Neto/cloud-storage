import React from 'react';
import { Button, Typography, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const { Title, Paragraph } = Typography;

export const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <Card className="home-card">
                <Title level={1}>Облачное хранилище My Cloud</Title>
                <Paragraph>
                    Храните, управляйте и делитесь своими файлами с лёгкостью.
                    Загружайте документы, фотографии и любые другие файлы в облако,
                    получайте доступ к ним с любого устройства.
                </Paragraph>
                <div className="home-buttons">
                    <Button type="primary" size="large" onClick={() => navigate('/login')}>
                        Вход
                    </Button>
                    <Button size="large" onClick={() => navigate('/register')}>
                        Регистрация
                    </Button>
                </div>
            </Card>
        </div>
    );
};