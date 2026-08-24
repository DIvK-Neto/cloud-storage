import React from 'react';
import { BaseModal } from '../../../../components/ui/all_ui';
import { RenameBulkSettings } from './RenameBulkSettings';
import { RenameBulkTable } from './RenameBulkTable';

export const BulkRenameModal = ({
    visible,
    onClose,
    onCancel,
    onConfirm,
    loading = false,
    isComplete = false,
    title = 'Переименовать',
    items = [],
    statuses = {},
    onRemoveItem,
    onUpdateItem,
    showOnlyProblems,
    setShowOnlyProblems,
    prefix,
    setPrefix,
    suffix,
    setSuffix,
    applyToAll,
    setApplyToAll,
    individualOverrides = {},
    resultStats = null,
}) => {
    const isPrefixAndSuffixEmpty = !prefix?.trim() && !suffix?.trim();
    const isActionDisabled = loading || (!isComplete && isPrefixAndSuffixEmpty && applyToAll);

    const actionLabel = isComplete ? 'Готово' : 'Переименовать';

    const handleAction = () => {
        if (isComplete) {
            onClose();
        } else {
            onConfirm();
        }
    };

    return (
        <BaseModal
            isOpen={visible}
            onClose={onClose}
            onCancel={onCancel}
            onAction={handleAction}
            actionLabel={actionLabel}
            isLoading={loading}
            isActionDisabled={isActionDisabled}
            title={`${title} (${items.length} элементов)`}
            helpText="Массовое переименование выбранных элементов. Задайте префикс и/или суффикс, либо отредактируйте имена вручную через ✏️ в таблице. При конфликте имён система предложит уникальное имя с индексом."
            showFilter={false}
        >
            <RenameBulkSettings
                prefix={prefix}
                setPrefix={setPrefix}
                suffix={suffix}
                setSuffix={setSuffix}
                applyToAll={applyToAll}
                setApplyToAll={setApplyToAll}
                disabled={isComplete}
                isPrefixAndSuffixEmpty={isPrefixAndSuffixEmpty}
            />

            <RenameBulkTable
                items={items}
                statuses={statuses}
                onRemoveItem={onRemoveItem}
                onUpdateItem={onUpdateItem}
                showOnlyProblems={showOnlyProblems}
                setShowOnlyProblems={setShowOnlyProblems}
                applyToAll={applyToAll}
                prefix={prefix}
                suffix={suffix}
                individualOverrides={individualOverrides}
                isComplete={isComplete}
            />
        </BaseModal>
    );
};