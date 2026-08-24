import React, { useState } from 'react';
import { Table, Tag, Tooltip, Button, Checkbox, message } from 'antd';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';

export const ShareTable = ({ items = [], linkType = 'individual', onRemoveItem }) => {
    const [filterProblematic, setFilterProblematic] = useState(false);

    const copyToClipboard = (link) => {
        navigator.clipboard.writeText(link);
        message.success('Ссылка скопирована');
    };

    const getStatusTag = (status, errorMessage = null) => {
        if (status === 'error') {
            const tag = <Tag color="error">❌ Ошибка</Tag>;
            if (errorMessage) {
                return <Tooltip title={errorMessage}>{tag}</Tooltip>;
            }
            return tag;
        }
        switch (status) {
            case 'pending':
                return <Tag color="default">⏳ Ожидание</Tag>;
            case 'success':
                return <Tag color="success">✅ Готово</Tag>;
            case 'warning':
                return <Tag color="warning">⚠️ Предупреждение</Tag>;
            default:
                return <Tag>—</Tag>;
        }
    };

    // Базовые колонки: Имя, Тип, Статус
    const baseColumns = [
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => (
                <span>
                    {record.type === 'folder' ? '📁 ' : '📄 '}
                    {text}
                </span>
            ),
        },
        {
            title: 'Тип',
            dataIndex: 'type',
            key: 'type',
            render: (type) => (type === 'folder' ? 'Папка' : 'Файл'),
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => getStatusTag(status, record.errorMessage),
        },
    ];

    // Колонка "Ссылка" (только для режима individual)
    const linkColumn = {
        title: 'Ссылка',
        dataIndex: 'link',
        key: 'link',
        render: (link) => link ? (
            <span style={{ wordBreak: 'break-all', fontSize: 12 }}>{link}</span>
        ) : '—',
    };

    // Колонка "Действия"
    const actionsColumn = {
        title: 'Действия',
        key: 'actions',
        render: (_, record) => (
            <div style={{ display: 'flex', gap: 8 }}>
                {record.link && (
                    <Tooltip title="Копировать ссылку">
                        <Button
                            size="small"
                            icon={<CopyOutlined />}
                            onClick={() => copyToClipboard(record.link)}
                        />
                    </Tooltip>
                )}
                <Tooltip title="Удалить из списка">
                    <Button
                        size="small"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            if (onRemoveItem) {
                                onRemoveItem(record);
                            } else {
                                message.info('Удаление из списка (заглушка)');
                            }
                        }}
                    />
                </Tooltip>
            </div>
        ),
    };

    // Собираем колонки в правильном порядке:
    // Для individual: Имя, Тип, Статус, Ссылка, Действия
    // Для common: Имя, Тип, Статус, Действия
    const columns = linkType === 'individual'
        ? [...baseColumns, linkColumn, actionsColumn]
        : [...baseColumns, actionsColumn];

    const filteredItems = filterProblematic
        ? items.filter((item) => item.status === 'warning' || item.status === 'error')
        : items;

    return (
        <div>
            <Checkbox
                checked={filterProblematic}
                onChange={(e) => setFilterProblematic(e.target.checked)}
                style={{ marginBottom: 8 }}
            >
                🔍 Показать только проблемные
            </Checkbox>
            <Table
                dataSource={filteredItems}
                columns={columns}
                rowKey={(record) => `${record.type}-${record.id}`}
                pagination={false}
                size="small"
                locale={{ emptyText: 'Нет элементов для отображения' }}
            />
        </div>
    );
};