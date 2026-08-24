import { useUpload } from '../useUpload';
import { useDelete } from '../useDelete';
import { useRename } from '../useRename';
import { useMove } from '../useMove';
import { useDownload } from '../useDownload';
import { useShare } from '../useShare';
import { useComment } from '../useComment';
import { useCreateFolder } from '../useCreateFolder';
import { useStats } from '../useStats';

export const useDashboardDataFolders = (
    currentFolderId,
    fetchItems,
    items,
    updateItem,
    removeItem,
    addItem,
    refreshStats
) => {
    const { handleUpload, handleUploadMultiple } = useUpload(
        currentFolderId,
        fetchItems,
        items,
        addItem,
        refreshStats
    );
    const { handleDeleteItem } = useDelete(currentFolderId, removeItem, refreshStats);
    const { handleRenameItem } = useRename(currentFolderId, updateItem, refreshStats);
    const { handleMoveItem } = useMove(currentFolderId, removeItem, addItem, refreshStats);
    const { handleDownloadFile } = useDownload();
    const { handleCreateShareLink } = useShare();
    const { handleUpdateComment } = useComment(currentFolderId, updateItem, refreshStats);
    const { handleCreateFolder } = useCreateFolder(addItem, refreshStats, fetchItems); // <-- ИСПРАВЛЕНО
    const { stats, loading: statsLoading } = useStats(currentFolderId, items);

    return {
        handleUpload,
        handleUploadMultiple,
        handleDeleteItem,
        handleRenameItem,
        handleMoveItem,
        handleDownloadFile,
        handleCreateShareLink,
        handleUpdateComment,
        handleCreateFolder,
        stats,
        statsLoading,
    };
};