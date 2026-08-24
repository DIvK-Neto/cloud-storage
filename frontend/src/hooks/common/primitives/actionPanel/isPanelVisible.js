export const isPanelVisible = (pinned, selectedCount) => {
    if (pinned) return true;
    return selectedCount > 0;
};