import React, { useState } from 'react';
import { Button, Typography, Badge, Dropdown, Tooltip } from 'antd';
import { PlusOutlined, FolderAddOutlined, DeleteOutlined, FilterOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { SearchField } from '../../../components/ui/all_ui';
import { SearchFiltersPanel } from '../../../components/ui/all_ui';

const { Title } = Typography;

export const DashboardHeader = ({
    onCreateFolder,
    onUpload,
    trashCount = 0,
    onSearch,
    onFilterChange,
    resetFilters,
    searchMode,
    itemType,
    caseSensitive,
    matchMode,
    isSearchActive,
}) => {
    const navigate = useNavigate();
    const [filterOpen, setFilterOpen] = useState(false);

    const goToTrash = () => {
        navigate('/trash');
    };

    return (
        <div className="dashboard-header">
            <Title level={2}>Мои файлы</Title>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                    <Dropdown
                        open={filterOpen}
                        onOpenChange={setFilterOpen}
                        popupRender={() => (
                            <SearchFiltersPanel
                                searchMode={searchMode}
                                itemType={itemType}
                                caseSensitive={caseSensitive}
                                matchMode={matchMode}
                                onSearchModeChange={(e) => onFilterChange({ searchMode: e.target.value })}
                                onItemTypeChange={(e) => onFilterChange({ itemType: e.target.value })}
                                onCaseSensitiveChange={(e) => onFilterChange({ caseSensitive: e.target.checked })}
                                onMatchModeChange={(e) => onFilterChange({ matchMode: e.target.value })}
                                onReset={resetFilters}
                                onClose={() => setFilterOpen(false)}
                                hideSearchMode={false}
                            />
                        )}
                        placement="bottomLeft"
                        trigger={['click']}
                        styles={{ root: { minWidth: '280px' } }}
                    >
                        <Button
                            type={isSearchActive && (searchMode !== 'current' || itemType !== 'all' || caseSensitive || matchMode !== 'contains') ? 'primary' : 'default'}
                            icon={<FilterOutlined />}
                            style={{ borderRadius: '4px 0 0 4px', height: '32px' }}
                        />
                    </Dropdown>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <SearchField
                            onSearch={onSearch}
                            placeholder="Поиск по имени..."
                            width={250}
                            allowClear={true}
                        />
                    </div>
                </div>
                <Button type="default" icon={<FolderAddOutlined />} onClick={onCreateFolder}>
                    Создать папку
                </Button>
                <Button type="primary" icon={<PlusOutlined />} onClick={onUpload}>
                    Загрузить
                </Button>
                <Badge count={trashCount} showZero={false}>
                    <Button type="default" icon={<DeleteOutlined />} onClick={goToTrash}>
                        Корзина
                    </Button>
                </Badge>
            </div>
        </div>
    );
};