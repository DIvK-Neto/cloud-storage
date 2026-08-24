import { useSettings } from './useSettings'; // <-- изменён импорт
import { isPanelVisible } from '../primitives/actionPanel/isPanelVisible';

export const useActionPanel = (selectedCount) => {
    const { pinned, togglePinned } = useSettings();
    const visible = isPanelVisible(pinned, selectedCount);

    return {
        pinned,
        visible,
        togglePin: togglePinned,
    };
};