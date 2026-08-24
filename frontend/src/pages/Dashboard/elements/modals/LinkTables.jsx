import React from 'react';
import { Table, Button, Typography, Tooltip, Modal as AntModal, message } from 'antd';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { formatDateTime } from '../../../../utils/all_utils';

const { Text } = Typography;

export const LinkTables = ({
    links = [],
    onEditLink,
    onDeleteLink,
    selectedItem,
}) => {
    if (!selectedItem) return null;

    const individualLinks = links.filter(link => link.type === 'individual');
    const collectionLinks = links.filter(link => link.type === 'collection');

    const handleCopyLink = (link) => {
        navigator.clipboard.writeText(link);
        message.success('Ссылка скопирована');
    };

    const renderLinkColumn = (text) => (
        <Tooltip title={text}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, width: '100%' }}>
                <a
                    href={text}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        flex: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        wordBreak: 'break-word',
                        color: '#1890ff',
                        textDecoration: 'underline',
                    }}
                >
                    {text}
                </a>
                <Button size="small" icon={<CopyOutlined />} onClick={() => handleCopyLink(text)} style={{ flexShrink: 0 }} />
            </div>
        </Tooltip>
    );

    const renderDate = (date) => {
        if (!date) return '—';
        const { date: d, time } = formatDateTime(date);
        return (
            <div>
                <div>{d}</div>
                <div>{time}</div>
            </div>
        );
    };

    const renderExpiration = (record) => {
        const { expires_at } = record;
        if (!expires_at) {
            return (
                <Tooltip title="Нажмите для редактирования срока действия ссылки">
                    <span
                        onClick={() => onEditLink(record)}
                        style={{
                            color: '#1890ff',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                        }}
                    >
                        ∞
                    </span>
                </Tooltip>
            );
        }
        const { date, time } = formatDateTime(expires_at);
        return (
            <Tooltip title="Нажмите для редактирования срока действия ссылки">
                <span
                    onClick={() => onEditLink(record)}
                    style={{
                        color: '#1890ff',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                    }}
                >
                    <div>{date}</div>
                    <div>{time}</div>
                </span>
            </Tooltip>
        );
    };

    const renderActions = (record) => (
        <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => {
                AntModal.confirm({
                    title: 'Удалить ссылку?',
                    content: 'Ссылка станет неактивной. Продолжить?',
                    onOk: () => onDeleteLink(record.id, record.type), // <-- изменено
                });
            }}
        />
    );

    const renderParameters = (record) => {
        const isView = record.link_type === 'view';
        const expiresAt = record.expires_at;
        const hasDate = !!expiresAt;
        const hasTime = hasDate && (() => {
            const d = new Date(expiresAt);
            return d.getHours() !== 0 || d.getMinutes() !== 0 || d.getSeconds() !== 0;
        })();

        const hasPasswordView = record.password_view && record.password_view.length > 0;
        const hasPasswordDownload = record.password_download && record.password_download.length > 0;

        return (
            <div style={{ display: 'flex', gap: 0, alignItems: 'center' }}>
                {/* 1. Доступ */}
                <Tooltip title={isView ? 'Только просмотр' : 'Разрешено скачивание'}>
                    <div style={{ width: 30, textAlign: 'center', borderRight: '1px solid rgba(0,0,0,0.06)' }}>
                        {isView ? '👁️' : '⬇️'}
                    </div>
                </Tooltip>
                {/* 2. Дата (∞ если бессрочно) */}
                <Tooltip title={hasDate ? `Срок: ${new Date(expiresAt).toLocaleDateString('ru-RU')}` : 'Бессрочно'}>
                    <div style={{ width: 30, textAlign: 'center', borderRight: '1px solid rgba(0,0,0,0.06)' }}>
                        {hasDate ? '📅' : '∞'}
                    </div>
                </Tooltip>
                {/* 3. Время */}
                <Tooltip title={hasTime ? `Время: ${new Date(expiresAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}` : 'Время не задано'}>
                    <div style={{ width: 30, textAlign: 'center', borderRight: '1px solid rgba(0,0,0,0.06)' }}>
                        {hasTime ? '🕐' : ''}
                    </div>
                </Tooltip>
                {/* 4. Пароль просмотра */}
                <Tooltip title={hasPasswordView ? 'Пароль для просмотра установлен' : 'Пароль для просмотра не установлен'}>
                    <div style={{ width: 30, textAlign: 'center', borderRight: '1px solid rgba(0,0,0,0.06)' }}>
                        {hasPasswordView ? '🔒' : ''}
                    </div>
                </Tooltip>
                {/* 5. Пароль скачивания */}
                <Tooltip title={hasPasswordDownload ? 'Пароль для скачивания установлен' : 'Пароль для скачивания не установлен'}>
                    <div style={{ width: 30, textAlign: 'center' }}>
                        {hasPasswordDownload ? '🛡️' : ''}
                    </div>
                </Tooltip>
            </div>
        );
    };

    const columns = [
        {
            title: 'Ссылка',
            key: 'link',
            width: 180,
            render: (_, record) => renderLinkColumn(record.link),
            onHeaderCell: () => ({
                style: { textAlign: 'center' },
            }),
        },
        {
            title: 'Дата создания',
            key: 'created_at',
            width: 130,
            render: (_, record) => renderDate(record.created_at),
            onHeaderCell: () => ({
                style: { textAlign: 'center' },
            }),
        },
        {
            title: 'Срок действия',
            key: 'expires_at',
            width: 130,
            render: (_, record) => renderExpiration(record),
            onHeaderCell: () => ({
                style: { textAlign: 'center' },
            }),
        },
        {
            title: 'Параметры',
            key: 'parameters',
            width: 150,
            render: (_, record) => renderParameters(record),
            onHeaderCell: () => ({
                style: { textAlign: 'center' },
            }),
        },
        {
            title: 'Переходы',
            dataIndex: 'views',
            width: 60,
            onHeaderCell: () => ({
                style: { textAlign: 'center' },
            }),
        },
        {
            title: 'Действия',
            key: 'actions',
            width: 60,
            render: (_, record) => renderActions(record),
            onHeaderCell: () => ({
                style: { textAlign: 'center' },
            }),
        },
    ];

    return (
        <div>
            {individualLinks.length > 0 && (
                <>
                    <h4>📌 Одиночные ссылки</h4>
                    <Table
                        dataSource={individualLinks}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                        size="small"
                    />
                </>
            )}
            {collectionLinks.length > 0 && (
                <>
                    <h4>📌 В составе коллекции</h4>
                    <Table
                        dataSource={collectionLinks}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                        size="small"
                    />
                </>
            )}
            {individualLinks.length === 0 && collectionLinks.length === 0 && (
                <Text type="secondary">Нет ссылок для этого элемента</Text>
            )}
        </div>
    );
};