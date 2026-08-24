export const createTask = (id, type, name, details = {}) => ({
    id,
    type,      // 'upload', 'download', 'delete', 'move', 'rename'
    name,
    progress: 0,
    status: 'pending', // 'pending', 'active', 'done', 'error'
    errorMessage: null,
    details,
});