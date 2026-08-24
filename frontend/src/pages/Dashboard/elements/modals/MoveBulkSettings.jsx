import React from 'react';
import { Radio, Input, Checkbox, Tooltip } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';

export const MoveBulkSettings = ({
    conflictRule,
    setConflictRule,
    prefix,
    setPrefix,
    suffix,
    setSuffix,
    applyToAll,
    setApplyToAll,
    disabled = false,
}) => {
    const isRenameMode = conflictRule === 'rename';
    const isPrefixAndSuffixEmpty = !prefix.trim() && !suffix.trim();

    return (
        <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 8 }}>
                <strong>Если имя совпадает:</strong>
            </div>
            <Radio.Group
                value={conflictRule}
                onChange={(e) => setConflictRule(e.target.value)}
                style={{ marginBottom: 8 }}
                disabled={disabled}
            >
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <Tooltip title="Перезаписать существующий файл в целевой папке">
                        <Radio value="replace">Заменить</Radio>
                    </Tooltip>
                    <Tooltip title="Добавить текст в начало и/или конец имени файла">
                        <Radio value="rename">Добавить префикс/суффикс</Radio>
                    </Tooltip>
                    <Tooltip title="Не перемещать этот элемент">
                        <Radio value="skip">Исключить</Radio>
                    </Tooltip>
                </div>
            </Radio.Group>

            {isRenameMode && (
                <div style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
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
                    {!disabled && isPrefixAndSuffixEmpty && (
                        <div style={{ marginTop: 8, padding: '8px 12px', background: '#fff7e6', borderRadius: 4, color: '#d48806', fontSize: 13 }}>
                            <InfoCircleOutlined style={{ marginRight: 8 }} />
                            Укажите хотя бы одно поле: префикс или суффикс. Если вы не хотите изменять имена, выберите «Заменить» или «Исключить».
                        </div>
                    )}
                </div>
            )}

            <div style={{ marginTop: 8 }}>
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
        </div>
    );
};