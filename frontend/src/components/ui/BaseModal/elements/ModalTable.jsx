import React from 'react';
import { formatFileSize, formatDateTime } from '../../../../utils/all_utils';

export const ModalTable = ({
    items = [],
    columns = [],
    selectedItems = [],
    onSelect,
    onRowAction,
    renderCell,
}) => {
    if (!items || items.length === 0) {
        return <div className="base-modal-empty">Нет элементов для отображения</div>;
    }

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allKeys = items.map(item => `${item.type}-${item.id}`);
            onSelect?.(allKeys);
        } else {
            onSelect?.([]);
        }
    };

    const isAllSelected = items.length > 0 && items.every(item =>
        selectedItems.includes(`${item.type}-${item.id}`)
    );

    return (
        <div className="base-modal-table-wrapper">
            <table className="base-modal-table">
                <thead>
                    <tr>
                        {onSelect && (
                            <th>
                                <input
                                    type="checkbox"
                                    checked={isAllSelected}
                                    onChange={handleSelectAll}
                                />
                            </th>
                        )}
                        {columns.map(col => (
                            <th key={col.key}>{col.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => {
                        const key = `${item.type}-${item.id}`;
                        const isSelected = selectedItems.includes(key);

                        return (
                            <tr key={key} className={item.status === 'warning' || item.status === 'error' ? 'base-modal-row-problem' : ''}>
                                {onSelect && (
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => onSelect(key)}
                                        />
                                    </td>
                                )}
                                {columns.map(col => {
                                    let value = item[col.key];
                                    if (col.key === 'size' && item.type === 'file') {
                                        value = formatFileSize(value);
                                    } else if (col.key === 'size' && item.type === 'folder') {
                                        value = '—';
                                    } else if (col.key === 'date' && value) {
                                        const formatted = formatDateTime(value);
                                        value = `${formatted.date} ${formatted.time}`;
                                    } else if (col.key === 'status') {
                                        const statusMap = {
                                            success: '✅',
                                            warning: '⚠️',
                                            error: '❌',
                                            pending: '⏳',
                                        };
                                        value = statusMap[value] || value;
                                    }
                                    if (renderCell) {
                                        const custom = renderCell(col.key, item);
                                        if (custom !== undefined) value = custom;
                                    }
                                    return <td key={col.key}>{value !== undefined && value !== null ? value : '—'}</td>;
                                })}
                                {onRowAction && (
                                    <td>
                                        <button onClick={() => onRowAction(item)}>✏️</button>
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};