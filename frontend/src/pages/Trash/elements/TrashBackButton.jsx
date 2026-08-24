import React from 'react';
import { Button, Tooltip } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

export const TrashBackButton = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate('/dashboard');
    };

    return (
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-start' }}>
            <Tooltip title="Вернуться в Мои файлы">
                <Button type="link" icon={<ArrowLeftOutlined />} onClick={goBack} style={{ padding: 0, fontSize: 14 }}>
                    Назад в Мои файлы
                </Button>
            </Tooltip>
        </div>
    );
};