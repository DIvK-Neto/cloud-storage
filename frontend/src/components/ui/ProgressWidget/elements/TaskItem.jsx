import React, { useState } from 'react';
import { getOperationIcon } from '../../../../utils/common/primitives/taskHelpers/getOperationIcon';
import { getStatusIcon } from '../../../../utils/common/primitives/taskHelpers/getStatusIcon';
import { getTaskStatusText } from '../../../../utils/common/primitives/taskHelpers/getTaskStatusText';
import { TaskDetails } from './TaskDetails';

export const TaskItem = ({ task, onNavigateToFolder }) => {
    const [expanded, setExpanded] = useState(false);

    const formatTime = (isoString) => {
        if (!isoString) return null;
        const date = new Date(isoString);
        return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    };

    const completedTime = task.completedAt ? formatTime(task.completedAt) : null;
    const count = task.details?.count || 0;

    return (
        <div style={{ padding: '6px 0', borderBottom: '1px solid #e8e8e8' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{getOperationIcon(task.type)}</span>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>
                        {task.name}
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 28 }}>
                    <span style={{ fontSize: 12, color: '#999', minWidth: 80 }}>
                        ({count} элемент{count > 1 ? 'ов' : ''})
                    </span>
                    <div style={{ width: 80, height: 6, background: '#f0f0f0', borderRadius: 4 }}>
                        <div style={{ width: `${task.progress}%`, height: 6, background: '#1890ff', borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: 12, minWidth: 36 }}>{task.progress}%</span>
                    <span>{getStatusIcon(task.status)}</span>
                    <span style={{ fontSize: 12, color: '#999' }}>{getTaskStatusText(task)}</span>
                    {completedTime && (
                        <span style={{ fontSize: 12, color: '#999' }}>{completedTime}</span>
                    )}
                    <button
                        onClick={() => setExpanded(!expanded)}
                        style={{ fontSize: 12, border: 'none', background: 'none', cursor: 'pointer', color: '#1890ff' }}
                    >
                        {expanded ? 'Скрыть' : 'Подробно'}
                    </button>
                </div>
            </div>

            {expanded && <TaskDetails task={task} onNavigateToFolder={onNavigateToFolder} />}
        </div>
    );
};