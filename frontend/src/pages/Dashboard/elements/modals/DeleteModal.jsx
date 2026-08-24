import React, { useMemo, useState } from 'react';
import { BaseModal } from '../../../../components/ui/all_ui';
import { Radio, Checkbox, Tooltip, Space, Typography } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

export const DeleteModal = ({
    visible,
    onClose,
    onCancel,
    onConfirm,
    loading = false,
    selectedItems = [],
    onRemoveItem,
    deleteMode,
    setDeleteMode,
    showOnlyProblems,
    setShowOnlyProblems,
    statuses = {},
}) => {
    const [showWarning, setShowWarning] = useState(false);

    const formatFileSize = (bytes) => {
        if (!bytes) return '—';
        const units = ['Б', 'КБ', 'МБ', 'ГБ'];
        let size = bytes;
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return `${size.toFixed(1)} ${units[unitIndex]}`;
    };

    const tableItems = useMemo(() => {
        return selectedItems.map((item) => {
            // statuses[item.id] теперь объект { status, reason, hasLinks, collections }
            const statusData = statuses[item.id] || {};
            const status = statusData.status || 'pending';

            let statusIcon = '⏳';
            let statusText = 'Ожидание';
            let statusColor = '#1890ff';
            let tooltipText = 'Проверка статуса...';

            if (status === 'success') {
                statusIcon = '✅';
                statusText = 'Готов';
                statusColor = '#52c41a';
                tooltipText = 'Элемент можно удалить.';
            } else if (status === 'warning') {
                statusIcon = '⚠️';
                statusText = 'Есть ссылки';
                statusColor = '#faad14';
                const hasLinks = statusData.hasLinks || false;
                const collections = statusData.collections || [];
                const parts = [];
                if (hasLinks) {
                    parts.push('У элемента есть активные ссылки.');
                }
                if (collections.length > 0) {
                    const list = collections.map(name => `- ${name}`).join('\n');
                    parts.push(`Элемент используется в коллекциях:\n${list}`);
                }
                if (parts.length > 0) {
                    parts.push('При удалении ссылки будут удалены, а элемент будет исключён из коллекций.');
                } else {
                    parts.push('Есть активные ссылки или коллекции.');
                }
                tooltipText = parts.join('\n\n');
            } else if (status === 'error') {
                statusIcon = '❌';
                statusText = 'Занят';
                statusColor = '#ff4d4f';
                tooltipText = statusData.reason || 'Элемент занят.';
            } else if (status === 'skipped') {
                statusIcon = '⏭️';
                statusText = 'Пропущен';
                statusColor = '#d9d9d9';
                tooltipText = 'Элемент не был удалён.';
            } else {
                statusIcon = '⏳';
                statusText = 'Ожидание';
                statusColor = '#1890ff';
                tooltipText = 'Проверка статуса...';
            }

            return {
                ...item,
                status,
                statusIcon,
                statusText,
                statusColor,
                tooltipText,
            };
        });
    }, [selectedItems, statuses]);

    const filteredItems = useMemo(() => {
        if (showOnlyProblems) {
            return tableItems.filter(item => item.status === 'warning' || item.status === 'error');
        }
        return tableItems;
    }, [tableItems, showOnlyProblems]);

    const hasErrorItems = tableItems.some(item => item.status === 'error');
    const hasReadyItems = tableItems.some(item => item.status === 'success' || item.status === 'warning');

    const columns = [
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
            width: '40%',
            render: (text, record) => (
                <Tooltip title={text}>
                    <Space>
                        {record.type === 'folder' ? '📁' : '📄'}
                        <span style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            display: 'inline-block',
                            maxWidth: '100%',
                        }}>
                            {text}
                        </span>
                    </Space>
                </Tooltip>
            ),
        },
        {
            title: 'Размер',
            dataIndex: 'size',
            key: 'size',
            width: '15%',
            render: (size) => (size ? formatFileSize(size) : '—'),
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            width: '30%',
            render: (_, record) => (
                <Tooltip title={record.tooltipText} styles={{ root: { whiteSpace: 'pre-line' } }}>
                    <span style={{ color: record.statusColor }}>
                        {record.statusIcon} {record.statusText}
                    </span>
                </Tooltip>
            ),
        },
        {
            title: 'Действия',
            key: 'actions',
            width: '15%',
            render: (_, record) => (
                <Tooltip title="Исключить из списка удаления">
                    <span
                        style={{ cursor: 'pointer', color: '#ff4d4f' }}
                        onClick={() => onRemoveItem(record)}
                    >
                        🗑
                    </span>
                </Tooltip>
            ),
        },
    ];

    return (
        <BaseModal
            isOpen={visible}
            onClose={onClose}
            onCancel={onCancel}
            onAction={onConfirm}
            actionLabel="Удалить"
            isLoading={loading}
            isActionDisabled={!hasReadyItems || hasErrorItems}
            title={`Удалить элементы (${selectedItems.length})`}
            showFilter={false}
            helpText="Перемещение в корзину позволяет восстановить элементы позже. Окончательное удаление безвозвратно."
        >
            <div style={{ marginBottom: 16 }}>
                <Radio.Group
                    value={deleteMode}
                    onChange={(e) => {
                        setDeleteMode(e.target.value);
                        if (e.target.value === 'permanent') {
                            setShowWarning(true);
                        } else {
                            setShowWarning(false);
                        }
                    }}
                    buttonStyle="solid"
                >
                    <Radio.Button value="trash">Переместить в корзину</Radio.Button>
                    <Radio.Button value="permanent">Удалить окончательно</Radio.Button>
                </Radio.Group>
                {showWarning && deleteMode === 'permanent' && (
                    <div style={{
                        marginTop: 8,
                        padding: '8px 12px',
                        background: '#fff2e8',
                        border: '1px solid #ffccc7',
                        borderRadius: '4px',
                        color: '#cf1322',
                    }}>
                        <ExclamationCircleOutlined style={{ marginRight: 8 }} />
                        <Text strong>Внимание!</Text>
                        <Text> Файлы и папки будут удалены безвозвратно. Это действие нельзя отменить.</Text>
                    </div>
                )}
            </div>

            <div style={{ marginBottom: 12 }}>
                <Checkbox
                    checked={showOnlyProblems}
                    onChange={(e) => setShowOnlyProblems(e.target.checked)}
                >
                    Показать только проблемные
                </Checkbox>
            </div>

            <div style={{ marginBottom: 16 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                            {columns.map(col => (
                                <th key={col.key} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 500 }}>
                                    {col.title}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.map(item => (
                            <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                {columns.map(col => (
                                    <td key={col.key} style={{ padding: '8px 12px' }}>
                                        {col.render ? col.render(item[col.dataIndex], item) : item[col.dataIndex]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {filteredItems.length === 0 && (
                            <tr>
                                <td colSpan={columns.length} style={{ padding: '16px', textAlign: 'center', color: '#999' }}>
                                    Нет элементов для отображения
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {hasErrorItems && (
                <div style={{ fontSize: 12, color: '#ff4d4f', marginBottom: 8 }}>
                    ⚠️ Некоторые элементы заняты и не могут быть удалены. Исключите их из коллекций.
                </div>
            )}
            {!hasReadyItems && !hasErrorItems && (
                <div style={{ fontSize: 12, color: '#faad14', marginBottom: 8 }}>
                    ⚠️ Нет элементов, готовых к удалению.
                </div>
            )}
        </BaseModal>
    );
};