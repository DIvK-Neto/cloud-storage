import React, { useState, useRef } from 'react';
import {
    Modal,
    Button,
    Table,
    Progress,
    Space,
    Typography,
    Upload,
    Tag,
    message,
} from 'antd';
import {
    InboxOutlined,
    DeleteOutlined,
    UploadOutlined,
    CloseOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import { useUploadProgress } from '../../primitives/hooks/useUploadProgress';
import { checkDuplicates, generateUniqueFileName } from '../../../../utils/all_utils';

const { Text } = Typography;
const { Dragger } = Upload;

export const UploadModal = ({
    visible,
    onCancel,
    onUpload,
    currentFolderId,
    existingItems = [],
    onSuccess,
}) => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [duplicates, setDuplicates] = useState([]);
    const [progressMap, setProgressMap] = useState({});
    const [statusMap, setStatusMap] = useState({});
    const fileInputRef = useRef(null);

    const { setProgress, clearProgress, resetAllProgress } = useUploadProgress();

    const resetState = () => {
        setFiles([]);
        setDuplicates([]);
        setProgressMap({});
        setStatusMap({});
        resetAllProgress();
    };

    const handleCancel = () => {
        resetState();
        onCancel();
    };

    const handleFileSelect = (fileList) => {
        const selectedFiles = fileList.map(f => f.originFileObj || f);
        const { duplicates: dup, unique } = checkDuplicates(selectedFiles, existingItems);

        if (dup.length > 0) {
            setDuplicates(prev => [...prev, ...dup]);
            message.warning(`Найдено ${dup.length} дубликатов. Они будут пропущены или заменены.`);
        }

        const newFiles = [...files, ...unique];
        setFiles(newFiles);

        const newStatusMap = { ...statusMap };
        const newProgressMap = { ...progressMap };
        unique.forEach(file => {
            newStatusMap[file.name] = 'pending';
            newProgressMap[file.name] = 0;
        });
        setStatusMap(newStatusMap);
        setProgressMap(newProgressMap);
    };

    const handleRemoveFile = (fileName) => {
        setFiles(prev => prev.filter(f => f.name !== fileName));
        const newStatusMap = { ...statusMap };
        const newProgressMap = { ...progressMap };
        delete newStatusMap[fileName];
        delete newProgressMap[fileName];
        setStatusMap(newStatusMap);
        setProgressMap(newProgressMap);
        clearProgress(fileName);
    };

    const handleUploadAll = async () => {
        if (files.length === 0) return;

        setUploading(true);
        let hasError = false;

        const uploadPromises = files.map(async (file) => {
            setStatusMap(prev => ({ ...prev, [file.name]: 'uploading' }));
            try {
                const isDuplicate = duplicates.some(d => d.name === file.name);
                if (isDuplicate) {
                    setStatusMap(prev => ({ ...prev, [file.name]: 'skipped' }));
                    return;
                }

                await onUpload(file, '', currentFolderId);
                setStatusMap(prev => ({ ...prev, [file.name]: 'done' }));
                setProgressMap(prev => ({ ...prev, [file.name]: 100 }));
            } catch (error) {
                setStatusMap(prev => ({ ...prev, [file.name]: 'error' }));
                hasError = true;
            }
        });

        await Promise.allSettled(uploadPromises);

        setUploading(false);
        if (!hasError) {
            message.success('Все файлы загружены');
            if (onSuccess) onSuccess();
            setTimeout(handleCancel, 1500);
        } else {
            message.error('Некоторые файлы не загружены');
        }
    };

    const columns = [
        {
            title: 'Файл',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <Text ellipsis>{text}</Text>,
        },
        {
            title: 'Размер',
            dataIndex: 'size',
            key: 'size',
            render: (size) => (size / 1024).toFixed(1) + ' КБ',
        },
        {
            title: 'Прогресс',
            dataIndex: 'name',
            key: 'progress',
            render: (name) => {
                const progress = progressMap[name] || 0;
                const status = statusMap[name] || 'pending';
                let color = '';
                if (status === 'done') color = 'success';
                else if (status === 'error') color = 'exception';
                else if (status === 'uploading') color = 'active';
                return (
                    <Progress
                        percent={progress}
                        status={status === 'error' ? 'exception' : status === 'done' ? 'success' : status === 'uploading' ? 'active' : 'normal'}
                        size="small"
                        style={{ width: 120 }}
                    />
                );
            },
        },
        {
            title: 'Статус',
            dataIndex: 'name',
            key: 'status',
            render: (name) => {
                const status = statusMap[name] || 'pending';
                let tag = '';
                let color = '';
                switch (status) {
                    case 'pending': tag = 'Ожидание'; color = 'default'; break;
                    case 'uploading': tag = 'Загрузка'; color = 'processing'; break;
                    case 'done': tag = 'Готово'; color = 'success'; break;
                    case 'error': tag = 'Ошибка'; color = 'error'; break;
                    case 'skipped': tag = 'Пропущен'; color = 'warning'; break;
                    default: tag = '—';
                }
                return <Tag color={color}>{tag}</Tag>;
            },
        },
        {
            title: 'Действие',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveFile(record.name)}
                    disabled={uploading || statusMap[record.name] === 'done'}
                />
            ),
        },
    ];

    const uploadProps = {
        name: 'file',
        multiple: true,
        showUploadList: false,
        beforeUpload: (file, fileList) => {
            handleFileSelect(fileList);
            return false;
        },
        accept: '*/*',
    };

    return (
        <Modal
            open={visible}
            title="Загрузка файлов"
            onCancel={handleCancel}
            footer={[
                <Button key="cancel" onClick={handleCancel}>
                    Закрыть
                </Button>,
                <Button
                    key="upload"
                    type="primary"
                    icon={<UploadOutlined />}
                    onClick={handleUploadAll}
                    loading={uploading}
                    disabled={files.length === 0 || uploading}
                >
                    Загрузить {files.length > 0 && `(${files.length})`}
                </Button>,
            ]}
            width={700}
            destroyOnHidden
        >
            <Space orientation="vertical" style={{ width: '100%' }}>
                {duplicates.length > 0 && (
                    <div style={{ marginBottom: 8, padding: '8px 12px', background: '#fff7e6', borderRadius: 4, color: '#d48806', fontSize: 13 }}>
                        <ExclamationCircleOutlined style={{ marginRight: 8 }} />
                        Обнаружено {duplicates.length} дубликатов. Они будут пропущены при загрузке.
                    </div>
                )}
                <Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Нажмите или перетащите файлы для загрузки</p>
                    <p className="ant-upload-hint">Поддерживаются любые файлы</p>
                </Dragger>
                {files.length > 0 && (
                    <Table
                        dataSource={files}
                        columns={columns}
                        rowKey="name"
                        pagination={false}
                        size="small"
                        scroll={{ y: 300 }}
                    />
                )}
                {files.length === 0 && (
                    <Text type="secondary" style={{ textAlign: 'center' }}>
                        Нет выбранных файлов
                    </Text>
                )}
            </Space>
        </Modal>
    );
};