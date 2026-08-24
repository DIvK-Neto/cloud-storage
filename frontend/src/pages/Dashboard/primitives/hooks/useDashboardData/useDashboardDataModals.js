import { useUploadModal } from '../../modal_hooks/useUploadModal';
import { useCreateFolderModal } from '../../modal_hooks/useCreateFolderModal';
import { useRenameModal } from '../../modal_hooks/useRenameModal';
import { useMoveModal } from '../../modal_hooks/useMoveModal';
import { useDeleteModal } from '../../modal_hooks/useDeleteModal';
import { useEditDescriptionModal } from '../../modal_hooks/useEditDescriptionModal';
import { useShareModal } from '../../modal_hooks/useShareModal';
import { useManageLinkModal } from '../../modal_hooks/useManageLinkModal';
import { useDownloadModal } from '../../modal_hooks/useDownloadModal'; // ← добавлено

export const useDashboardDataModals = (
    handleCreateFolder,
    currentFolderId,
    handleRenameItem,
    handleMoveItem,
    handleDeleteItem,
    handleUpdateComment,
    handleCreateShareLinks,
    updateItem,
    removeItem,
    addItem,
    refreshStats,
    fetchItems,
    modalKeepOnClose
) => {
    const uploadModal = useUploadModal();
    const createFolderModal = useCreateFolderModal(handleCreateFolder, currentFolderId);
    const renameModal = useRenameModal(handleRenameItem, currentFolderId);
    const moveModal = useMoveModal(handleMoveItem, currentFolderId);
    const deleteModal = useDeleteModal(handleDeleteItem, currentFolderId);
    const editDescriptionModal = useEditDescriptionModal(handleUpdateComment, currentFolderId);

    const shareModal = useShareModal(
        handleCreateShareLinks,
        fetchItems,
        currentFolderId,
        modalKeepOnClose
    );

    const manageLinkModal = useManageLinkModal(updateItem, refreshStats, currentFolderId);

    // ↓↓↓ ДОБАВЛЕНО
    const downloadModal = useDownloadModal(
        fetchItems,
        currentFolderId,
        modalKeepOnClose
    );
    // ↑↑↑

    return {
        uploadModal,
        createFolderModal,
        renameModal,
        moveModal,
        deleteModal,
        editDescriptionModal,
        shareModal,
        manageLinkModal,
        downloadModal, // ← добавлено
    };
};