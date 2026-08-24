import React from 'react';
import { useProgressWidget } from '../../../../hooks/common/collections/progressWidget';

export const TaskTabs = () => {
    const { activeTab, setActiveTab } = useProgressWidget();
    const tabs = ['Все', 'Активные', 'Завершено', 'Ошибки'];

    return (
        <div style={{ display: 'flex', gap: 16, padding: '8px 0' }}>
            {tabs.map(tab => (
                <span
                    key={tab}
                    style={{
                        cursor: 'pointer',
                        color: activeTab === tab ? '#1890ff' : '#666',
                        borderBottom: activeTab === tab ? '2px solid #1890ff' : 'none',
                        paddingBottom: 4,
                    }}
                    onClick={() => setActiveTab(tab)}
                >
                    {tab}
                </span>
            ))}
        </div>
    );
};