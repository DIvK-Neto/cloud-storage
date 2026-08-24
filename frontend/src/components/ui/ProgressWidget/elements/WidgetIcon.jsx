import React from 'react';
import { useTask } from '../../../../context/all_context';
import { TaskCounter } from './TaskCounter';
import './../ProgressWidget.css';

export const WidgetIcon = () => {
    const { isExpanded, setIsExpanded } = useTask();
    const { tasks, getActiveTasks } = useTask();
    const activeTasks = getActiveTasks(tasks);

    const togglePanel = () => {
        setIsExpanded(!isExpanded);
    };

    return (
        <div className="progress-widget-icon" onClick={togglePanel}>
            <span role="img" aria-label="tasks" style={{ fontSize: 24 }}>📦</span>
            <TaskCounter />
        </div>
    );
};