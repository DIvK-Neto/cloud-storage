import React from 'react';
import { Typography, Button } from 'antd';
import { FolderOutlined, FileOutlined } from '@ant-design/icons';

const { Text } = Typography;

// Естественное сравнение строк (регистронезависимое, числа внутри строк сравниваются как числа)
const naturalCompare = (a, b) => {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
};

export const NameColumn = ({ onNavigate }) => ({
    title: 'Имя',
    dataIndex: 'name',
    key: 'name',
    render: (text, record) => {
        const isFolder = record.type === 'folder';
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    width: '100%',
                    minHeight: 40,
                }}
            >
                {isFolder ? (
                    <FolderOutlined style={{ fontSize: 20, color: '#1890ff', flexShrink: 0 }} />
                ) : (
                    <FileOutlined style={{ fontSize: 20, color: '#8c8c8c', flexShrink: 0 }} />
                )}
                {isFolder ? (
                    <Button
                        type="link"
                        onClick={() => onNavigate(record.id)}
                        style={{
                            padding: 0,
                            height: 'auto',
                            whiteSpace: 'normal',
                            textAlign: 'left',
                            wordBreak: 'break-word',
                            lineHeight: 1.4,
                        }}
                    >
                        {text}
                    </Button>
                ) : (
                    <Text
                        style={{
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                            lineHeight: 1.4,
                        }}
                    >
                        {text}
                    </Text>
                )}
            </div>
        );
    },
    sorter: (a, b) => {
        // Папки всегда сверху
        if (a.type === 'folder' && b.type !== 'folder') return -1;
        if (a.type !== 'folder' && b.type === 'folder') return 1;
        // Оба одного типа — сортируем естественно
        return naturalCompare(a.name, b.name);
    },
});