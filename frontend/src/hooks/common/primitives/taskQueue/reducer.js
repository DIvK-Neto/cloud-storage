// Редьюсер для управления списком задач
export const taskReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TASK':
            return [...state, action.payload];

        case 'UPDATE_TASK':
            return state.map(task =>
                task.id === action.payload.id
                    ? { ...task, ...action.payload.data }
                    : task
            );

        case 'COMPLETE_TASK':
            return state.map(task =>
                task.id === action.payload.id
                    ? { ...task, status: action.payload.status, progress: 100, errorMessage: action.payload.error || null }
                    : task
            );

        case 'CLEAR_COMPLETED':
            return state.filter(task => task.status !== 'done' && task.status !== 'error');

        default:
            return state;
    }
};