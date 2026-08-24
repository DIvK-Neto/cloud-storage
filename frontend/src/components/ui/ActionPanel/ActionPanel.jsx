import React, { useRef } from 'react';
import { useActionPanel } from '../../../hooks/common/collections/actionPanel';
import { useActionPanelResponsive } from '../../../hooks/common/collections/actionPanel';
import { useUnfinishedAction } from '../../../hooks/common/collections/actionPanel';
import { SelectionCounter } from '../common/SelectionCounter/SelectionCounter';
import { ActionButtons } from './elements/ActionButtons';
import { PinButton } from './elements/PinButton';
import { MockSelector } from './elements/MockSelector';
import { MockWidgetButton } from './elements/MockWidgetButton';
import { useTask } from '../../../context/all_context';
import { createTask } from '../../../utils/common/primitives/taskHelpers/createTask';
import './ActionPanel.css';

export const ActionPanel = ({
    selectedCount,
    onDownload,
    onShare,
    onRename,
    onMove,
    onDelete,
    customButtons = null, // <-- новый проп
    children = null,      // <-- для дополнительных элементов
}) => {
    const { visible, pinned, togglePin } = useActionPanel(selectedCount);
    const wrapperRef = useRef(null);
    const { isOverflowing, isExpanded, toggleExpanded } = useActionPanelResponsive(wrapperRef);
    const { addTask, updateTask, completeTask } = useTask();

    const { getUnfinishedKeys, hasAnyUnfinished } = useUnfinishedAction();
    const unfinishedKeys = getUnfinishedKeys();
    const hasAny = hasAnyUnfinished();

    const simulateWidget = () => {
        const tasks = [
            { id: 'sim-1', type: 'upload', name: 'report.pdf' },
            { id: 'sim-2', type: 'download', name: 'photo.jpg' },
            { id: 'sim-3', type: 'delete', name: 'old_file.txt' },
            { id: 'sim-4', type: 'move', name: 'project/' },
        ];

        tasks.forEach((t, index) => {
            const task = createTask(t.id, t.type, t.name);
            addTask(task);

            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 20 + 10;
                if (progress >= 100) {
                    clearInterval(interval);
                    completeTask(t.id, 'done');
                } else {
                    updateTask(t.id, { progress: Math.min(progress, 100), status: 'active' });
                }
            }, 1000 + index * 500);
        });
    };

    if (!visible) return null;

    return (
        <div className="action-panel">
            <SelectionCounter count={selectedCount} />
            <div className="spacer" />
            <MockSelector currentTarget={null} onSelect={() => { }} />
            <MockWidgetButton onClick={simulateWidget} />

            <div
                className={`action-buttons-wrapper${isExpanded ? ' expanded' : ''}`}
                ref={wrapperRef}
            >
                {customButtons ? customButtons : (
                    <ActionButtons
                        onDownload={onDownload}
                        onShare={onShare}
                        onRename={onRename}
                        onMove={onMove}
                        onDelete={onDelete}
                        unfinishedKeys={unfinishedKeys}
                        hasAnyUnfinished={hasAny}
                    />
                )}
                {children}
            </div>

            {isOverflowing && (
                <button className="expand-btn" onClick={toggleExpanded}>
                    {isExpanded ? '▲' : '▼'}
                </button>
            )}

            <div className="separator" />
            <PinButton pinned={pinned} onToggle={togglePin} />
        </div>
    );
};