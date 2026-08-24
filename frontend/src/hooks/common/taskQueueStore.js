import { useState } from 'react';

let tasks = [];
let listeners = [];

export const taskQueueStore = {
    getTasks: () => tasks,
    addTask: (task) => {
        tasks = [...tasks, task];
        listeners.forEach(fn => fn(tasks));
    },
    updateTask: (id, data) => {
        tasks = tasks.map(t => t.id === id ? { ...t, ...data } : t);
        listeners.forEach(fn => fn(tasks));
    },
    completeTask: (id, status, error = null) => {
        tasks = tasks.map(t => t.id === id ? { ...t, status, progress: 100, errorMessage: error } : t);
        listeners.forEach(fn => fn(tasks));
    },
    subscribe: (listener) => {
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    },
};