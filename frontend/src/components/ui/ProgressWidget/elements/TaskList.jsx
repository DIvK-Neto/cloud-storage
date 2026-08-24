import React from 'react';
import { useProgressWidget } from '../../../../hooks/common/collections/progressWidget';
import { getActiveTasks } from '../../../../hooks/common/collections/taskQueue';
import { getCompletedTasks } from '../../../../hooks/common/collections/taskQueue';
import { getErrorTasks } from '../../../../hooks/common/collections/taskQueue';
import { TaskItem } from './TaskItem';

export const TaskList = ({ tasks, onNavigateToFolder }) => {
    const { activeTab } = useProgressWidget();

    let filtered = tasks;

    if (activeTab === 'Активные') filtered = getActiveTasks(tasks);
    else if (activeTab === 'Завершено') filtered = getCompletedTasks(tasks);
    else if (activeTab === 'Ошибки') filtered = getErrorTasks(tasks);

    if (filtered.length === 0) {
        return <div style={{ color: '#999', padding: '16px 0' }}>Нет задач</div>;
    }

    return (
        <div>
            {filtered.map(task => (
                <TaskItem key={task.id} task={task} onNavigateToFolder={onNavigateToFolder} />
            ))}
        </div>
    );
};