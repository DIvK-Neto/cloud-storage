import { useState } from 'react';
import { useTask } from '../../../context/TaskContext';

export const useProgressWidget = () => {
    const { activeTab, setActiveTab } = useTask(); // ← берём из контекста
    const [isVisible, setIsVisible] = useState(false);

    return { isVisible, setIsVisible, activeTab, setActiveTab };
};