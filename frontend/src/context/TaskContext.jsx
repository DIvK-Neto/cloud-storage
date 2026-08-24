import React, { createContext, useContext, useReducer, useState } from 'react';
import { taskReducer } from '../hooks/common/primitives/taskQueue/reducer';
import { addTask as addTaskAction } from '../hooks/common/primitives/taskQueue/addTask';
import { updateTask as updateTaskAction } from '../hooks/common/primitives/taskQueue/updateTask';
import { completeTask as completeTaskAction } from '../hooks/common/primitives/taskQueue/completeTask';
import { clearCompleted as clearCompletedAction } from '../hooks/common/primitives/taskQueue/clearCompleted';
import { getActiveTasks } from '../hooks/common/primitives/taskQueue/getActiveTasks';
import { getCompletedTasks } from '../hooks/common/primitives/taskQueue/getCompletedTasks';
import { getErrorTasks } from '../hooks/common/primitives/taskQueue/getErrorTasks';
import { getAllTasks } from '../hooks/common/primitives/taskQueue/getAllTasks';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
    const [tasks, dispatch] = useReducer(taskReducer, []);
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeTab, setActiveTab] = useState('Все');

    const addTask = (task) => dispatch(addTaskAction(task));
    const updateTask = (id, data) => dispatch(updateTaskAction(id, data));
    const completeTask = (id, status, error = null) => dispatch(completeTaskAction(id, status, error));
    const clearCompleted = () => dispatch(clearCompletedAction());

    return (
        <TaskContext.Provider value={{
            tasks,
            addTask,
            updateTask,
            completeTask,
            clearCompleted,
            getActiveTasks: () => getActiveTasks(tasks),
            getCompletedTasks: () => getCompletedTasks(tasks),
            getErrorTasks: () => getErrorTasks(tasks),
            getAllTasks: () => getAllTasks(tasks),
            isExpanded,
            setIsExpanded,
            activeTab,
            setActiveTab,
        }}>
            {children}
        </TaskContext.Provider>
    );
};

export const useTask = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTask must be used within TaskProvider');
    }
    return context;
};