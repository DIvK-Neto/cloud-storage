import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Spin, Button, Typography, Input, message, Card, Modal } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import api from '../../api/axios';
import { formatFileSize } from '../../utils/all_utils';

const { Title, Paragraph } = Typography;

const SharedFileView = () => {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    const [password, setPassword] = useState('');
    const [isPasswordRequired, setIsPasswordRequired] = useState(false);

    const fetchData = async (pwd = null) => {
        setLoading(true);
        setError(null);
        try {
            const params = pwd ? { password: pwd } : {};
            const response = await api.get(`/share/${uuid}/`, { params });
            if (response.data.requires_password) {
                setIsPasswordRequired(true);
                setLoading(false);
                return;
            }
            setData(response.data);
            setIsPasswordRequired(false);
        } catch (err) {
            if (err.response?.status === 401 && err.response?.data?.requires_password) {
                setIsPasswordRequired(true);
                setLoading(false);
                return;
            }
            const msg = err.response?.data?.error || 'Ошибка загрузки';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        const downloadUrl = `/share/${uuid}/?download=true`;
        try {
            const params = {};
            if (data?.requires_password_download) {
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
                        title: 'Папка пуста',
                        content: `Папка "${data?.name || 'без названия'}" пуста. Вы уверены, что хотите скачать пустой архив?`,
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
                            link.download = `${data?.name || 'folder'}.zip`;
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
            // 🔥 ИСПРАВЛЕНИЕ: для папок добавляем .zip
            link.download = data?.type === 'folder' ? `${data.name}.zip` : (data?.name || 'file');
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
        fetchData();
    }, [uuid]);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: 40 }}>
                <Spin size="large" tip="Загрузка..." />
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
                <Paragraph>Для просмотра содержимого введите пароль:</Paragraph>
                <Input.Password
                    placeholder="Введите пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onPressEnter={() => fetchData(password)}
                />
                <Button type="primary" style={{ marginTop: 12 }} onClick={() => fetchData(password)}>
                    Войти
                </Button>
            </div>
        );
    }

    if (!data) {
        return (
            <div style={{ textAlign: 'center', padding: 40 }}>
                <Title level={3}>Не удалось загрузить данные</Title>
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

    if (data.type === 'file') {
        const fields = [
            { label: 'Размер', value: formatFileSize(data.size), icon: '💾' },
            { label: 'Тип', value: data.file_type || '—', icon: '📂' },
            { label: 'Окончание доступа', value: data.expires_at ? new Date(data.expires_at).toLocaleString() : 'Бессрочно', icon: '📅' },
            { label: 'Осталось', value: data.remaining || '—', icon: '⏳' },
        ];

        return (
            <div style={{ maxWidth: 600, margin: '40px auto', padding: 24 }}>
                <Card>
                    <Title level={3} style={{ marginBottom: 8 }}>📄 {data.name}</Title>
                    {renderInfo(fields)}
                    {data.allow_download && (
                        <Button type="primary" size="large" icon={<DownloadOutlined />} onClick={handleDownload} block>
                            Скачать
                        </Button>
                    )}
                </Card>
            </div>
        );
    }

    if (data.type === 'folder') {
        const fields = [
            { label: 'Элементов', value: data.items?.length || 0, icon: '📂' },
            { label: 'Окончание доступа', value: data.expires_at ? new Date(data.expires_at).toLocaleString() : 'Бессрочно', icon: '📅' },
            { label: 'Осталось', value: data.remaining || '—', icon: '⏳' },
        ];

        return (
            <div style={{ maxWidth: 800, margin: '40px auto', padding: 24 }}>
                <Card>
                    <Title level={3} style={{ marginBottom: 8 }}>📁 {data.name}</Title>
                    {renderInfo(fields)}
                    {data.items && data.items.length > 0 && (
                        <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                            {data.items.map((item) => (
                                <li key={item.id} style={{ padding: '4px 0', borderBottom: '1px solid #f0f0f0' }}>
                                    <span style={{ marginRight: 8 }}>{item.type === 'folder' ? '📁' : '📄'}</span>
                                    {item.name}
                                    {item.type === 'file' && item.size !== undefined && (
                                        <span style={{ float: 'right', color: '#999' }}>{formatFileSize(item.size)}</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                    {data.allow_download && (
                        <Button type="primary" size="large" icon={<DownloadOutlined />} onClick={handleDownload} block style={{ marginTop: 16 }}>
                            Скачать всё ZIP
                        </Button>
                    )}
                </Card>
            </div>
        );
    }

    return <div>Неизвестный тип</div>;
};

export default SharedFileView;