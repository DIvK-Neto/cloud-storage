import React from 'react';
import { BaseModal } from '../../../../components/ui/all_ui';
import { Button, Modal as AntModal } from 'antd';
import { LinkTables } from './LinkTables';
import { LinkSettings } from './LinkSettings';
import { useEditLink } from '../../primitives/modal_hooks/useEditLink';

export const ManageLinkModal = ({
    visible,
    onClose,
    selectedItem,
    links = [],
    loading: parentLoading,
    onDelete,
    onExtend,
}) => {
    const {
        editModalVisible,
        loading,
        expirationType,
        setExpirationType,
        customDays,
        setCustomDays,
        expirationDate,
        setExpirationDate,
        timeType,
        setTimeType,
        customTime,
        setCustomTime,
        allowDownload,
        setAllowDownload,
        passwordViewEnabled,
        setPasswordViewEnabled,
        passwordDownloadEnabled,
        setPasswordDownloadEnabled,
        passwordView,
        setPasswordView,
        passwordDownload,
        setPasswordDownload,
        openEditor,
        closeEditor,
        saveLink,
    } = useEditLink(onExtend);

    if (!selectedItem) return null;

    return (
        <>
            <BaseModal
                isOpen={visible}
                onClose={onClose}
                onAction={null}
                actionLabel=""
                isLoading={parentLoading}
                title={<span>Управление ссылкой: <strong>{selectedItem.name}</strong></span>}
                showFilter={false}
                showActionButton={false}
                showCancelButton={false}
            >
                <LinkTables
                    links={links}
                    onEditLink={openEditor}
                    onDeleteLink={onDelete}
                    selectedItem={selectedItem}
                />
            </BaseModal>

            <AntModal
                open={editModalVisible}
                title="Редактировать ссылку"
                onCancel={closeEditor}
                width={700}
                confirmLoading={loading}
                footer={[
                    <Button key="submit" type="primary" onClick={saveLink} loading={loading}>
                        Сохранить
                    </Button>,
                    <Button key="cancel" onClick={closeEditor}>
                        Отмена
                    </Button>,
                ]}
            >
                <LinkSettings
                    showLinkType={false}
                    expirationType={expirationType}
                    setExpirationType={setExpirationType}
                    customDays={customDays}
                    setCustomDays={setCustomDays}
                    expirationDate={expirationDate}
                    setExpirationDate={setExpirationDate}
                    timeType={timeType}
                    setTimeType={setTimeType}
                    customTime={customTime}
                    setCustomTime={setCustomTime}
                    hasDateSelected={expirationType === 'date'}
                    allowDownload={allowDownload}
                    setAllowDownload={setAllowDownload}
                    passwordViewEnabled={passwordViewEnabled}
                    setPasswordViewEnabled={setPasswordViewEnabled}
                    passwordDownloadEnabled={passwordDownloadEnabled}
                    setPasswordDownloadEnabled={setPasswordDownloadEnabled}
                    passwordView={passwordView}
                    setPasswordView={setPasswordView}
                    passwordDownload={passwordDownload}
                    setPasswordDownload={setPasswordDownload}
                />
            </AntModal>
        </>
    );
};