import React from 'react';
import { WidgetIcon } from './elements/WidgetIcon';
import { WidgetPanel } from './elements/WidgetPanel';
import './ProgressWidget.css';

export const ProgressWidget = ({ onNavigateToFolder }) => {
    return (
        <>
            <WidgetIcon />
            <WidgetPanel onNavigateToFolder={onNavigateToFolder} />
        </>
    );
};