import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Button, Typography, List, Card, Input, message, Modal } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import api from '../../api/axios';
import { formatFileSize } from '../../utils/all_utils';

const { Title, Paragraph } = Typography;

const SharedCollectionView = () => {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [collection, setCollection] = useState(null);
    const [password, setPassword] = useState('');
    const [isPasswordRequired, setIsPasswordRequired] = useState(false);

    const fetchCollection = async (pwd = null) => {
        setLoading(true);
        setError(null);
        try {
            const params = pwd ? { password: pwd } : {};
            const response = await api.get(`/share/collection/${uuid}/`, { params });
            if (response.data.requires_password) {
                setIsPasswordRequired(true);
                setLoading(false);
                return;
            }
            setCollection(response.data);
            setIsPasswordRequired(false);
        } catch (err) {
            if (err.response?.status === 401 && err.response?.data?.requires_password) {
                setIsPasswordRequired(true);
                setLoading(false);
                return;
            }
            const msg = err.response?.data?.error || 'Ошибка загрузки коллекции';
            setError(msg);
            if (err.response?.status === 404) {
                message.error('Коллекция не найдена');
            } else if (err.response?.status === 410) {
                message.error('Срок действия ссылки истёк');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        const downloadUrl = `/share/collection/${uuid}/?download=true`;
        try {
            const params = {};
            if (collection?.requires_password_download) {
                const pwd = prompt('Введите пароль для скачивания:');
                if (!pwd) return;
                params.password = pwd;
            }
            const response = await api.get(downloadUrl, {
                params,
                responseType: 'blob',
            });
            const contentType = response.headers['content-type'] || '';
            if (contentType.includes('application/json')) {
                const text = await response.data.text();
                const json = JSON.parse(text);
                if (json.empty) {
                    Modal.confirm({
                        title: 'Коллекция пуста',
                        content: `Коллекция "${collection?.name || 'без названия'}" пуста. Вы уверены, что хотите скачать пустой архив?`,
                        okText: 'Скачать',
                        cancelText: 'Отмена',
                        onOk: async () => {
                            const forceParams = { ...params, force_empty: 'true' };
                            const forceResponse = await api.get(downloadUrl, {
                                params: forceParams,
                                responseType: 'blob',
                            });
                            const blob = new Blob([forceResponse.data]);
                            const url = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `${collection?.name || 'collection'}.zip`;
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                            window.URL.revokeObjectURL(url);
                            message.success('Скачивание начато');
                        },
                    });
                    return;
                }
                message.error(json.error || 'Ошибка скачивания');
                return;
            }
            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${collection?.name || 'collection'}.zip`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            message.success('Скачивание начато');
        } catch (err) {
            message.error(err.response?.data?.error || 'Ошибка скачивания');
        }
    };

    useEffect(() => {
        fetchCollection();
    }, [uuid]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 40 }}>
                <Spin size="large" tip="Загрузка коллекции..." />
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: 40 }}>
                <Title level={3} type="danger">Ошибка</Title>
                <Paragraph>{error}</Paragraph>
                <Button type="primary" onClick={() => navigate('/')}>На главную</Button>
            </div>
        );
    }

    if (isPasswordRequired) {
        return (
            <div style={{ maxWidth: 400, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                <Title level={3}>Требуется пароль</Title>
                <Paragraph>Для просмотра коллекции введите пароль:</Paragraph>
                <Input.Password
                    placeholder="Введите пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onPressEnter={() => fetchCollection(password)}
                />
                <Button type="primary" style={{ marginTop: 12 }} onClick={() => fetchCollection(password)}>
                    Войти
                </Button>
            </div>
        );
    }

    if (!collection) {
        return (
            <div style={{ textAlign: 'center', padding: 40 }}>
                <Title level={3}>Коллекция не найдена</Title>
                <Button type="primary" onClick={() => navigate('/')}>На главную</Button>
            </div>
        );
    }

    const renderInfo = (fields) => {
        return (
            <div style={{
                display: 'grid',
                gridTemplateColumns: '180px 1fr',
                gap: '8px 16px',
                marginTop: 16,
                marginBottom: 16,
            }}>
                {fields.map(({ label, value, icon }) => (
                    <React.Fragment key={label}>
                        <div style={{ fontWeight: 'bold', color: '#555', textAlign: 'right' }}>{icon} {label}</div>
                        <div style={{ textAlign: 'left' }}>{value}</div>
                    </React.Fragment>
                ))}
            </div>
        );
    };

    const fields = [
        { label: 'Элементов', value: collection.items?.length || 0, icon: '📂' },
        { label: 'Разрешить скачивание', value: collection.allow_download ? 'Да' : 'Нет', icon: '⬇️' },
        { label: 'Разрешить комментарии', value: collection.allow_comments ? 'Да' : 'Нет', icon: '💬' },
        { label: 'Окончание доступа', value: collection.expires_at ? new Date(collection.expires_at).toLocaleString() : 'Бессрочно', icon: '📅' },
        { label: 'Осталось', value: collection.remaining || '—', icon: '⏳' },
    ];

    return (
        <div style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}>
            <Card>
                <Title level={3} style={{ marginBottom: 8 }}>📚 {collection.name}</Title>
                {renderInfo(fields)}
                <Title level={4} style={{ marginBottom: 8 }}>Элементы коллекции</Title>
                <List
                    bordered
                    dataSource={collection.items || []}
                    renderItem={(item) => (
                        <List.Item>
                            <span style={{ marginRight: 8 }}>
                                {item.type === 'file' ? '📄' : '📁'}
                            </span>
                            <span style={{ flex: 1 }}>{item.name}</span>
                            {item.type === 'file' && item.size !== undefined && (
                                <span style={{ color: '#999', fontSize: 12 }}>
                                    {formatFileSize(item.size)}
                                </span>
                            )}
                        </List.Item>
                    )}
                    locale={{ emptyText: 'В коллекции нет элементов' }}
                />
                <div style={{ marginTop: 16, display: 'flex', gap: 12, flexDirection: 'column' }}>
                    {collection.allow_download && (
                        <Button type="primary" size="large" icon={<DownloadOutlined />} onClick={handleDownload} block>
                            Скачать всё (ZIP)
                        </Button>
                    )}
                    <Button onClick={() => navigate('/')} block>
                        На главную
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default SharedCollectionView;