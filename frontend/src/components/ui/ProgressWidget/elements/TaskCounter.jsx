import React from 'react';
import { useTask } from '../../../../context/all_context';

export const TaskCounter = () => {
    const { tasks, getActiveTasks } = useTask();
    const activeCount = getActiveTasks(tasks).length;

    if (activeCount === 0) return null;

    return <span className="badge">{activeCount}</span>;
};