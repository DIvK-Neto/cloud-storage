import React from 'react';
import { Dropdown, Button, Tooltip } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const mockOptions = [
    { key: null, label: 'Без имитации' },
    { key: 'download', label: 'Имитация у Скачать' },
    { key: 'share', label: 'Имитация у Поделиться' },
    { key: 'rename', label: 'Имитация у Переименовать' },
    { key: 'move', label: 'Имитация у Переместить' },
    { key: 'delete', label: 'Имитация у Удалить' },
];

export const MockSelector = ({ currentTarget, onSelect }) => {
    const items = mockOptions.map(opt => ({
        key: opt.key || 'none',
        label: opt.label,
        onClick: () => onSelect(opt.key),
    }));

    const selectedLabel = mockOptions.find(opt => opt.key === currentTarget)?.label || 'Без имитации';

    return (
        <Tooltip title="Выберите кнопку для имитации незавершённого действия">
            <Dropdown menu={{ items }} trigger={['click']}>
                <Button type="text" icon={<SettingOutlined />}>
                    {selectedLabel}
                </Button>
            </Dropdown>
        </Tooltip>
    );
};