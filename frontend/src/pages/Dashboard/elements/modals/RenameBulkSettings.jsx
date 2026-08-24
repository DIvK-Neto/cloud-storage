import React from 'react';
import { Input, Checkbox, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

export const RenameBulkSettings = ({
    prefix,
    setPrefix,
    suffix,
    setSuffix,
    applyToAll,
    setApplyToAll,
    disabled = false,
    isPrefixAndSuffixEmpty,
}) => {
    return (
        <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 8 }}>
                <strong>Массовое переименование:</strong>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
                <Tooltip title="Текст будет добавлен в начало имени файла">
                    <Input
                        placeholder="Префикс (например, Копия_)"
                        value={prefix}
                        onChange={(e) => setPrefix(e.target.value)}
                        style={{ width: 200 }}
                        disabled={disabled}
                    />
                </Tooltip>
                <Tooltip title="Текст будет добавлен в конец имени файла, перед расширением">
                    <Input
                        placeholder="Суффикс (например, _backup)"
                        value={suffix}
                        onChange={(e) => setSuffix(e.target.value)}
                        style={{ width: 200 }}
                        disabled={disabled}
                    />
                </Tooltip>
            </div>
            {!disabled && isPrefixAndSuffixEmpty && applyToAll && (
                <div style={{ marginBottom: 8, padding: '8px 12px', background: '#e6f7ff', borderRadius: 4, color: '#0050b3', fontSize: 13 }}>
                    <InfoCircleOutlined style={{ marginRight: 8 }} />
                    Укажите префикс или суффикс, или отредактируйте имена вручную через ✏️ в таблице.
                </div>
            )}
            <Tooltip title="Применить настройки ко всем элементам. При выключении — индивидуальная настройка для каждого элемента">
                <Checkbox
                    checked={applyToAll}
                    onChange={(e) => setApplyToAll(e.target.checked)}
                    disabled={disabled}
                >
                    Применить ко всем элементам
                </Checkbox>
            </Tooltip>
        </div>
    );
};