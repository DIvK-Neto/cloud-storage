import { useStats } from '../useStats';

export const useDashboardDataStats = (currentFolderId, items) => {
    const { stats, loading: statsLoading } = useStats(currentFolderId, items);

    return {
        stats,
        statsLoading,
    };
};