import React from 'react';
import { useTask } from '../../../../context/TaskContext';
import { TaskTabs } from './TaskTabs';
import { TaskList } from './TaskList';

export const WidgetPanel = ({ onNavigateToFolder }) => {
    const { isExpanded, setIsExpanded, tasks, getAllTasks } = useTask();
    const allTasks = getAllTasks(tasks);

    if (!isExpanded) return null;

    return (
        <div className="progress-widget-panel">
            <div className="header">
                <span>Прогресс операций</span>
                <button className="close-btn" onClick={() => setIsExpanded(false)}>×</button>
            </div>
            <div className="tabs">
                <TaskTabs />
            </div>
            <div className="list">
                <TaskList tasks={allTasks} onNavigateToFolder={onNavigateToFolder} />
            </div>
            <div className="footer">
                Всего задач: {allTasks.length}
            </div>
        </div>
    );
};