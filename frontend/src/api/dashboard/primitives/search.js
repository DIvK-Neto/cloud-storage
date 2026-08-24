import api from '../../axios';

export const searchDashboard = (folderId, search, page = 1, pageSize = 20, ordering = 'name', options = {}) => {
    const params = {
        folder_id: folderId,
        search: search || undefined,
        page: page,
        page_size: pageSize,
        ordering: ordering,
        // Фильтры
        search_mode: options.searchMode || 'current',
        case_sensitive: options.caseSensitive ? 'true' : 'false',
        match_mode: options.matchMode || 'contains',
        item_type: options.itemType || 'all',
    };
    return api.get('/dashboard/search/', { params });
};