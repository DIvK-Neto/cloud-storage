export const getOperationIcon = (type) => {
    const icons = {
        upload: '⬆',
        download: '⬇',
        delete: '🗑',
        move: '📁',
        rename: '✏️',
        share: '🔗',   // добавлено
    };
    return icons[type] || '📄';
};