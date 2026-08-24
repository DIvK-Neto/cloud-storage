import React from 'react';
import { Checkbox, Radio, Button, Tooltip } from 'antd';
import { UpOutlined } from '@ant-design/icons';

export const SearchFiltersPanel = ({
    searchMode,
    itemType,
    caseSensitive,
    matchMode,
    onSearchModeChange,
    onItemTypeChange,
    onCaseSensitiveChange,
    onMatchModeChange,
    onReset,
    onClose,
    hideSearchMode = false,
}) => {
    return (
        <div style={{ padding: '16px', minWidth: '280px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '16px' }}>🔍 Фильтры</span>
                <Tooltip title="Свернуть">
                    <Button type="text" icon={<UpOutlined />} onClick={onClose} size="small" />
                </Tooltip>
            </div>

            {!hideSearchMode && (
                <div style={{ marginBottom: '12px' }}>
                    <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                        Поиск:
                        <Tooltip title="Поиск только в открытой папке или во всех вложенных папках">
                            <span style={{ marginLeft: 4, cursor: 'help', color: '#1890ff' }}>ⓘ</span>
                        </Tooltip>
                    </div>
                    <Radio.Group value={searchMode} onChange={onSearchModeChange} buttonStyle="solid" size="small">
                        <Radio.Button value="current" style={{ borderRadius: '4px 0 0 4px' }}>В текущей папке</Radio.Button>
                        <Radio.Button value="all" style={{ borderRadius: '0 4px 4px 0' }}>По всем папкам</Radio.Button>
                    </Radio.Group>
                </div>
            )}

            <div style={{ marginBottom: '12px' }}>
                <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                    Тип элементов:
                    <Tooltip title="Показывать только папки, только файлы или все элементы">
                        <span style={{ marginLeft: 4, cursor: 'help', color: '#1890ff' }}>ⓘ</span>
                    </Tooltip>
                </div>
                <Radio.Group value={itemType} onChange={onItemTypeChange} buttonStyle="solid" size="small">
                    <Radio.Button value="all" style={{ borderRadius: '4px 0 0 4px' }}>Все</Radio.Button>
                    <Radio.Button value="folders">Папки</Radio.Button>
                    <Radio.Button value="files" style={{ borderRadius: '0 4px 4px 0' }}>Файлы</Radio.Button>
                </Radio.Group>
            </div>

            <div style={{ marginBottom: '12px' }}>
                <Tooltip title="Различать заглавные и строчные буквы при поиске">
                    <Checkbox checked={caseSensitive} onChange={onCaseSensitiveChange}>
                        Учитывать регистр
                    </Checkbox>
                </Tooltip>
            </div>

            <div style={{ marginBottom: '12px' }}>
                <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                    Совпадение:
                    <Tooltip title="Общее — поиск по части слова, Точное — полное совпадение">
                        <span style={{ marginLeft: 4, cursor: 'help', color: '#1890ff' }}>ⓘ</span>
                    </Tooltip>
                </div>
                <Radio.Group value={matchMode} onChange={onMatchModeChange} buttonStyle="solid" size="small">
                    <Radio.Button value="contains" style={{ borderRadius: '4px 0 0 4px' }}>Общее (содержит)</Radio.Button>
                    <Radio.Button value="exact" style={{ borderRadius: '0 4px 4px 0' }}>Точное (полное)</Radio.Button>
                </Radio.Group>
            </div>

            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center' }}>
                <Button onClick={onReset} type="default" size="small">
                    Сбросить фильтры
                </Button>
            </div>
        </div>
    );
};