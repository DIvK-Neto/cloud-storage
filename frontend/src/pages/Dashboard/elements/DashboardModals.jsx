import React from 'react';
import { UploadModal } from './modals/UploadModal';
import { RenameModal } from './modals/RenameModal';
import { MoveModal } from './modals/MoveModal';
import { ConfirmModal } from './modals/ConfirmModal';
import { CreateFolderModal } from './modals/CreateFolderModal';
import { EditDescriptionModal } from './modals/EditDescriptionModal';
import { ShareModal } from './modals/ShareModal';
import { ManageLinkModal } from './modals/ManageLinkModal';
import { DownloadModal } from './modals/DownloadModal';
import { BulkRenameModal } from './modals/BulkRenameModal';
import { DeleteModal } from './modals/DeleteModal';  // добавляем

export const DashboardModals = ({
    uploadModal,
    createFolderModal,
    renameModal,
    moveModal,
    deleteModal,
    editDescriptionModal,
    shareModal,
    manageLinkModal,
    downloadModal,
    bulkMoveModal,
    bulkRenameModal,
    bulkDeleteModal,        // добавляем
    currentFolderId,
    items,
    fetchItems,
    handleUpload,
    folders,
}) => {
    return (
        <>
            <UploadModal
                visible={uploadModal.visible}
                onCancel={uploadModal.close}
                onUpload={handleUpload}
                currentFolderId={currentFolderId}
                existingItems={items}
                onSuccess={() => fetchItems(currentFolderId)}
            />

            <RenameModal
                visible={renameModal.visible}
                onCancel={renameModal.close}
                onConfirm={renameModal.handleConfirm}
                currentName={renameModal.selectedItem?.name || ''}
                loading={renameModal.loading}
            />

            <MoveModal
                visible={moveModal.visible}
                onCancel={moveModal.close}
                onConfirm={moveModal.handleConfirm}
                currentItemId={moveModal.selectedItem?.id || null}
                currentFolderId={currentFolderId}
                loading={moveModal.loading}
                mode="single"
            />

            <MoveModal
                visible={bulkMoveModal.visible}
                onClose={bulkMoveModal.close}
                onCancel={bulkMoveModal.cancel}
                onConfirm={bulkMoveModal.handleMove}
                currentFolderId={currentFolderId}
                loading={bulkMoveModal.loading}
                mode="bulk"
                title={`Переместить (${bulkMoveModal.currentItems?.length || 0} элементов)`}
                items={bulkMoveModal.currentItems || []}
                statuses={bulkMoveModal.statuses || {}}
                onRemoveItem={bulkMoveModal.removeItem}
                onUpdateItem={bulkMoveModal.updateItem}
                showOnlyProblems={bulkMoveModal.showOnlyProblems}
                setShowOnlyProblems={bulkMoveModal.setShowOnlyProblems}
                conflictRule={bulkMoveModal.conflictRule}
                setConflictRule={bulkMoveModal.setConflictRule}
                prefix={bulkMoveModal.prefix}
                setPrefix={bulkMoveModal.setPrefix}
                suffix={bulkMoveModal.suffix}
                setSuffix={bulkMoveModal.setSuffix}
                applyToAll={bulkMoveModal.applyToAll}
                setApplyToAll={bulkMoveModal.setApplyToAll}
                individualOverrides={bulkMoveModal.individualOverrides || {}}
                targetFolderId={bulkMoveModal.targetFolderId}
                setTargetFolderId={bulkMoveModal.setTargetFolderId}
                isComplete={bulkMoveModal.isComplete}
                resultStats={bulkMoveModal.resultStats}
            />

            <BulkRenameModal
                visible={bulkRenameModal.visible}
                onClose={bulkRenameModal.close}
                onCancel={bulkRenameModal.cancel}
                onConfirm={bulkRenameModal.handleRename}
                loading={bulkRenameModal.loading}
                isComplete={bulkRenameModal.isComplete}
                title="Переименовать"
                items={bulkRenameModal.currentItems || []}
                statuses={bulkRenameModal.statuses || {}}
                onRemoveItem={bulkRenameModal.removeItem}
                onUpdateItem={bulkRenameModal.updateItem}
                showOnlyProblems={bulkRenameModal.showOnlyProblems}
                setShowOnlyProblems={bulkRenameModal.setShowOnlyProblems}
                prefix={bulkRenameModal.prefix}
                setPrefix={bulkRenameModal.setPrefix}
                suffix={bulkRenameModal.suffix}
                setSuffix={bulkRenameModal.setSuffix}
                applyToAll={bulkRenameModal.applyToAll}
                setApplyToAll={bulkRenameModal.setApplyToAll}
                individualOverrides={bulkRenameModal.individualOverrides || {}}
                resultStats={bulkRenameModal.resultStats}
            />

            <ConfirmModal
                visible={deleteModal.visible}
                onCancel={deleteModal.close}
                onConfirm={deleteModal.handleConfirm}
                title="Удаление файла"
                content={`Вы уверены, что хотите удалить "${deleteModal.selectedItem?.name || ''}"? Это действие нельзя отменить.`}
                danger
                loading={deleteModal.loading}
            />

            <CreateFolderModal
                visible={createFolderModal.visible}
                onCancel={createFolderModal.close}
                onConfirm={createFolderModal.handleConfirm}
                loading={createFolderModal.loading}
            />

            <EditDescriptionModal
                visible={editDescriptionModal.visible}
                onCancel={editDescriptionModal.close}
                onConfirm={editDescriptionModal.handleConfirm}
                currentDescription={
                    editDescriptionModal.selectedItem?.type === 'folder'
                        ? editDescriptionModal.selectedItem?.description || ''
                        : editDescriptionModal.selectedItem?.comment || ''
                }
                itemName={editDescriptionModal.selectedItem?.name || ''}
                loading={editDescriptionModal.loading}
            />

            <ShareModal
                visible={shareModal.visible}
                onClose={shareModal.close}
                onCancel={shareModal.cancel}
                onConfirm={shareModal.handleCreateLinks}
                loading={shareModal.loading}
                selectedItems={shareModal.selectedItems}
                onRemoveItem={shareModal.removeItem}
                linkType={shareModal.linkType}
                setLinkType={shareModal.setLinkType}
                expirationType={shareModal.expirationType}
                setExpirationType={shareModal.setExpirationType}
                customDays={shareModal.customDays}
                setCustomDays={shareModal.setCustomDays}
                expirationDate={shareModal.expirationDate}
                setExpirationDate={shareModal.setExpirationDate}
                timeType={shareModal.timeType}
                setTimeType={shareModal.setTimeType}
                customTime={shareModal.customTime}
                setCustomTime={shareModal.setCustomTime}
                hasDateSelected={shareModal.hasDateSelected}
                allowDownload={shareModal.allowDownload}
                setAllowDownload={shareModal.setAllowDownload}
                passwordViewEnabled={shareModal.passwordViewEnabled}
                setPasswordViewEnabled={shareModal.setPasswordViewEnabled}
                passwordDownloadEnabled={shareModal.passwordDownloadEnabled}
                setPasswordDownloadEnabled={shareModal.setPasswordDownloadEnabled}
                passwordView={shareModal.passwordView}
                setPasswordView={shareModal.setPasswordView}
                passwordDownload={shareModal.passwordDownload}
                setPasswordDownload={shareModal.setPasswordDownload}
                generatedLinks={shareModal.generatedLinks}
            />

            <ManageLinkModal
                visible={manageLinkModal.visible}
                onClose={manageLinkModal.close}
                selectedItem={manageLinkModal.selectedItem}
                links={manageLinkModal.links}
                loading={manageLinkModal.loading}
                onDelete={manageLinkModal.handleDelete}
                onExtend={manageLinkModal.handleExtend}
            />

            <DownloadModal
                visible={downloadModal.visible}
                onClose={downloadModal.close}
                onCancel={downloadModal.cancel}
                onConfirm={downloadModal.handleDownload}
                loading={downloadModal.loading}
                selectedItems={downloadModal.currentItems}
                onRemoveItem={downloadModal.removeItem}
                onRenameItem={downloadModal.renameItem}
                formatType={downloadModal.formatType}
                setFormatType={downloadModal.setFormatType}
                archiveName={downloadModal.archiveName}
                setArchiveName={downloadModal.setArchiveName}
                archivePassword={downloadModal.archivePassword}
                setArchivePassword={downloadModal.setArchivePassword}
                showPassword={downloadModal.showPassword}
                setShowPassword={downloadModal.setShowPassword}
                saveFolder={downloadModal.saveFolder}
                setSaveFolder={downloadModal.setSaveFolder}
                statuses={downloadModal.statuses}
            />

            {/* Новая модалка массового удаления */}
            <DeleteModal
                visible={bulkDeleteModal.visible}
                onClose={bulkDeleteModal.close}
                onCancel={bulkDeleteModal.cancel}
                onConfirm={bulkDeleteModal.handleDelete}
                loading={bulkDeleteModal.loading}
                selectedItems={bulkDeleteModal.currentItems}
                onRemoveItem={bulkDeleteModal.removeItem}
                deleteMode={bulkDeleteModal.deleteMode}
                setDeleteMode={bulkDeleteModal.setDeleteMode}
                showOnlyProblems={bulkDeleteModal.showOnlyProblems}
                setShowOnlyProblems={bulkDeleteModal.setShowOnlyProblems}
                statuses={bulkDeleteModal.statuses}
            />
        </>
    );
};