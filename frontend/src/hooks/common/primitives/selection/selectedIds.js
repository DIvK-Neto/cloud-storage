export const selectedIds = (state = [], action) => {
    switch (action.type) {
        case 'SET_SELECTED_IDS':
            return action.payload;
        case 'CLEAR_SELECTION':
            return [];
        default:
            return state;
    }
};