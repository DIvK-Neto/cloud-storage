import React, { memo, useState } from 'react';
import { Button, Typography, Dropdown, Tooltip, Space } from 'antd';
import { DeleteOutlined, FilterOutlined } from '@ant-design/icons';
import { SearchField } from '../../../components/ui/all_ui';
import { SearchFiltersPanel } from '../../../components/ui/all_ui';

const { Title } = Typography;

export const TrashHeader = memo(({
    onSearch,
    onClearTrash,
    trashCount = 0,
    onFilterChange,
    resetFilters,
    itemType,
    caseSensitive,
    matchMode,
    isSearchActive,
}) => {
    const [searchValue, setSearchValue] = useState('');
    const [filterOpen, setFilterOpen] = useState(false);

    const handleSearch = (value) => {
        setSearchValue(value);
        onSearch(value);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <Title level={2} style={{ margin: 0 }}>Корзина</Title>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, justifyContent: 'center' }}>
                <Space>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Dropdown
                            open={filterOpen}
                            onOpenChange={setFilterOpen}
                            popupRender={() => (
                                <SearchFiltersPanel
                                    searchMode="current"
                                    itemType={itemType}
                                    caseSensitive={caseSensitive}
                                    matchMode={matchMode}
                                    onSearchModeChange={null}
                                    onItemTypeChange={(e) => onFilterChange({ itemType: e.target.value })}
                                    onCaseSensitiveChange={(e) => onFilterChange({ caseSensitive: e.target.checked })}
                                    onMatchModeChange={(e) => onFilterChange({ matchMode: e.target.value })}
                                    onReset={resetFilters}
                                    onClose={() => setFilterOpen(false)}
                                    hideSearchMode={true}
                                />
                            )}
                            placement="bottomLeft"
                            trigger={['click']}
                            styles={{ root: { minWidth: '280px' } }}
                        >
                            <Button
                                type={isSearchActive && (itemType !== 'all' || caseSensitive || matchMode !== 'contains') ? 'primary' : 'default'}
                                icon={<FilterOutlined />}
                                style={{ borderRadius: '4px 0 0 4px', height: '32px' }}
                            />
                        </Dropdown>
                        <SearchField
                            onSearch={handleSearch}
                            placeholder="Поиск по имени..."
                            width={300}
                            allowClear={true}
                        />
                    </div>
                </Space>
            </div>
            <Button
                danger
                icon={<DeleteOutlined />}
                onClick={onClearTrash}
                disabled={trashCount === 0}
            >
                Очистить корзину
            </Button>
        </div>
    );
});