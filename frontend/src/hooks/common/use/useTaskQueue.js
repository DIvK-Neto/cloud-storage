import { useReducer } from 'react';
import { taskReducer } from '../primitives/taskQueue/reducer';
import { addTask as addTaskAction } from '../primitives/taskQueue/addTask';
import { updateTask as updateTaskAction } from '../primitives/taskQueue/updateTask';
import { completeTask as completeTaskAction } from '../primitives/taskQueue/completeTask';
import { clearCompleted as clearCompletedAction } from '../primitives/taskQueue/clearCompleted';
import { getActiveTasks } from '../primitives/taskQueue/getActiveTasks';
import { getCompletedTasks } from '../primitives/taskQueue/getCompletedTasks';
import { getErrorTasks } from '../primitives/taskQueue/getErrorTasks';
import { getAllTasks } from '../primitives/taskQueue/getAllTasks';

export const useTaskQueue = () => {
    const [tasks, dispatch] = useReducer(taskReducer, []);

    const addTask = (task) => dispatch(addTaskAction(task));
    const updateTask = (id, data) => dispatch(updateTaskAction(id, data));
    const completeTask = (id, status, error = null) => dispatch(completeTaskAction(id, status, error));
    const clearCompleted = () => dispatch(clearCompletedAction());

    return {
        tasks,
        addTask,
        updateTask,
        completeTask,
        clearCompleted,
        getActiveTasks: () => getActiveTasks(tasks),
        getCompletedTasks: () => getCompletedTasks(tasks),
        getErrorTasks: () => getErrorTasks(tasks),
        getAllTasks: () => getAllTasks(tasks),
    };
};