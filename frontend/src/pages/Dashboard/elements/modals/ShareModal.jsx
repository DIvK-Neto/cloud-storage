import React, { useMemo } from 'react';
import { BaseModal } from '../../../../components/ui/all_ui';
import { LinkSettings } from './LinkSettings';
import { ShareTable } from './ShareTable';
import { message } from 'antd';

export const ShareModal = ({
    visible,
    onClose,        // ← будет вызываться при клике на ✕ или вне модалки (сохраняет)
    onCancel,       // ← ДОБАВЛЕНО (будет вызываться при клике на кнопку "Отмена")
    onConfirm,
    loading = false,
    selectedItems = [],
    onRemoveItem,
    linkType,
    setLinkType,
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
    hasDateSelected,
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
    generatedLinks = [],
}) => {
    const tableItems = useMemo(() => {
        return selectedItems.map((item) => {
            const generated = generatedLinks.find((g) => g.id === item.id);
            return {
                ...item,
                status: generated?.status || 'pending',
                link: generated?.link || null,
                errorMessage: generated?.errorMessage || null,
            };
        });
    }, [selectedItems, generatedLinks]);

    const commonLink = linkType === 'common' && generatedLinks.length > 0 ? generatedLinks[0]?.link : null;

    return (
        <BaseModal
            isOpen={visible}
            onClose={onClose}          // ✕ и клик вне → сохраняет
            onCancel={onCancel}        // кнопка "Отмена" → очищает
            onAction={onConfirm}
            actionLabel="Создать ссылку"
            isLoading={loading}
            title={`Поделиться (${selectedItems.length} элементов)`}
            showFilter={false}
        >
            <LinkSettings
                showLinkType={true}
                linkType={linkType}
                setLinkType={setLinkType}
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
                hasDateSelected={hasDateSelected}
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

            {commonLink && (
                <div style={{ marginBottom: 16, padding: 8, background: '#f5f5f5', borderRadius: 4 }}>
                    <strong>Общая ссылка:</strong>
                    <br />
                    <span style={{ wordBreak: 'break-all' }}>{commonLink}</span>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(commonLink);
                            message.success('Ссылка скопирована');
                        }}
                        style={{ marginLeft: 8 }}
                    >
                        📋 Копировать
                    </button>
                </div>
            )}

            <ShareTable
                items={tableItems}
                linkType={linkType}
                onRemoveItem={onRemoveItem}
            />
        </BaseModal>
    );
};