import React, { useMemo } from 'react';
import { BaseModal } from '../../../../components/ui/all_ui';
import { Radio, Input, Button, Checkbox, Tooltip, Space, message } from 'antd';
import { FolderOpenOutlined, CopyOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { DownloadTable } from './DownloadTable';

export const DownloadModal = ({
    visible,
    onClose,
    onCancel,
    onConfirm,
    loading = false,
    selectedItems = [],
    onRemoveItem,
    onRenameItem,
    formatType,
    setFormatType,
    archiveName,
    setArchiveName,
    archivePassword,
    setArchivePassword,
    showPassword,
    setShowPassword,
    saveFolder,
    setSaveFolder,
    statuses = {},
}) => {
    const tableItems = useMemo(() => {
        return selectedItems.map((item) => {
            const status = statuses[item.id] || 'pending';
            return {
                ...item,
                status,
            };
        });
    }, [selectedItems, statuses]);

    const isFolderPickerSupported = 'showDirectoryPicker' in window;

    const handleSelectFolder = async () => {
        if (!isFolderPickerSupported) {
            message.info('Выбор папки недоступен в вашем браузере. При скачивании файлов будет открыт диалог «Сохранить как».');
            return;
        }
        try {
            const dirHandle = await window.showDirectoryPicker();
            const path = dirHandle.name;
            setSaveFolder(path);
            localStorage.setItem('downloadFolder', path);
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Ошибка выбора папки:', err);
            }
        }
    };

    const handleCopyPassword = () => {
        if (archivePassword) {
            navigator.clipboard.writeText(archivePassword);
            message.success('Пароль скопирован');
        }
    };

    return (
        <BaseModal
            isOpen={visible}
            onClose={onClose}
            onCancel={onCancel}
            onAction={onConfirm}
            actionLabel="Скачать"
            isLoading={loading}
            title={`Скачать (${selectedItems.length} элементов)`}
            showFilter={false}
            isActionDisabled={selectedItems.length === 0}
        >
            <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FolderOpenOutlined />
                    <Tooltip title="Выберите папку на устройстве для сохранения файлов. Если не выбрано, файлы будут скачаны в стандартную папку загрузок.">
                        <span style={{ fontWeight: 500 }}>Папка сохранения</span>
                    </Tooltip>
                    {!isFolderPickerSupported && (
                        <Tooltip title="Ваш браузер не поддерживает выбор папки. При скачивании каждого элемента будет открываться диалог «Сохранить как» для выбора папки.">
                            <QuestionCircleOutlined style={{ color: '#faad14', cursor: 'help' }} />
                        </Tooltip>
                    )}
                </div>
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Button
                        icon={<FolderOpenOutlined />}
                        onClick={handleSelectFolder}
                        disabled={!isFolderPickerSupported}
                    >
                        {isFolderPickerSupported ? 'Выбрать папку' : 'Выбор папки недоступен'}
                    </Button>
                    {saveFolder && (
                        <span style={{ fontSize: 12, color: '#666' }}>
                            {saveFolder}
                        </span>
                    )}
                </div>
                {!isFolderPickerSupported && (
                    <div style={{ marginTop: 4, fontSize: 12, color: '#888' }}>
                        ⓘ Выбор папки недоступен. При скачивании каждого файла будет открыт диалог «Сохранить как».
                        Поддерживается в Chrome, Edge, Opera.
                    </div>
                )}
            </div>

            <div style={{ marginBottom: 16 }}>
                <Tooltip title="Каждый элемент отдельно — файлы скачиваются как есть, папки — ZIP-архивами. Всё одним архивом — все элементы упаковываются в один ZIP-архив.">
                    <span style={{ fontWeight: 500 }}>Формат скачивания</span>
                </Tooltip>
                <Radio.Group
                    value={formatType}
                    onChange={(e) => setFormatType(e.target.value)}
                    style={{ marginTop: 8 }}
                >
                    <Radio value="individual">Каждый элемент отдельно</Radio>
                    <Radio value="zip">Всё одним ZIP-архивом</Radio>
                </Radio.Group>
                {formatType === 'zip' && (
                    <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span>Имя архива:</span>
                        <Input
                            value={archiveName}
                            onChange={(e) => setArchiveName(e.target.value)}
                            placeholder="Введите имя архива"
                            style={{ width: 250 }}
                        />
                    </div>
                )}
            </div>

            {formatType === 'zip' && (
                <div style={{ marginBottom: 16 }}>
                    <Checkbox
                        checked={showPassword}
                        onChange={(e) => setShowPassword(e.target.checked)}
                    >
                        Добавить пароль на архив
                    </Checkbox>
                    {showPassword && (
                        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <Input.Password
                                value={archivePassword}
                                onChange={(e) => setArchivePassword(e.target.value)}
                                placeholder="Введите пароль"
                                style={{ width: 200 }}
                                suffix={
                                    <Tooltip title="Скопировать пароль">
                                        <CopyOutlined
                                            style={{ cursor: 'pointer' }}
                                            onClick={handleCopyPassword}
                                        />
                                    </Tooltip>
                                }
                            />
                        </div>
                    )}
                </div>
            )}

            <DownloadTable
                items={tableItems}
                onRemoveItem={onRemoveItem}
                onRenameItem={onRenameItem}
                formatType={formatType}
                saveFolder={saveFolder}
            />
        </BaseModal>
    );
};