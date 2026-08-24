import React from 'react';
import { message, Tooltip } from 'antd';
import { CopyOutlined, FileOutlined, FolderOutlined, FolderOpenOutlined, EyeOutlined } from '@ant-design/icons';
import api from '../../../../api/axios';

export const TaskDetails = ({ task, onNavigateToFolder }) => {
    if (!task.details) return null;

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            message.success('Ссылка скопирована в буфер обмена');
        }).catch(() => {
            message.error('Не удалось скопировать ссылку');
        });
    };

    const linkTypeDisplay = task.details.linkType === 'Общая ссылка' ? 'Общая' : 'Отдельная';

    const truncateLink = (link) => {
        if (link.length > 35) {
            return link.slice(0, 35) + '...';
        }
        return link;
    };

    const handleReDownload = async (file) => {
        if (!file.id) return;

        try {
            let url;
            if (file.type === 'file') {
                url = `/files/${file.id}/download/`;
            } else if (file.type === 'folder') {
                url = `/folders/${file.id}/download-folder/`;
            } else if (file.type === 'zip') {
                const params = task.details.zipParams;
                if (!params || !params.ids) {
                    message.warning('Не удалось повторить скачивание архива');
                    return;
                }
                const query = new URLSearchParams();
                query.append('items', params.ids.join(','));
                if (params.name) query.append('name', params.name);
                if (params.password) query.append('password', params.password);
                const zipUrl = `/download/bulk/?${query.toString()}`;
                const response = await api.get(zipUrl, { responseType: 'blob' });

                const contentType = response.headers['content-type'] || '';
                if (contentType.includes('application/json')) {
                    const text = await response.data.text();
                    const json = JSON.parse(text);
                    message.error(json.error || 'Ошибка повторного скачивания архива');
                    return;
                }

                const blob = new Blob([response.data]);
                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = `${params.name || 'archive'}.zip`;
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(downloadUrl);
                message.success('Скачивание архива начато');
                return;
            } else {
                return;
            }

            const response = await api.get(url, { responseType: 'blob' });

            const contentType = response.headers['content-type'] || '';
            if (contentType.includes('application/json')) {
                const text = await response.data.text();
                const json = JSON.parse(text);
                message.error(json.error || 'Ошибка скачивания');
                return;
            }

            const blob = new Blob([response.data]);
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;

            const contentDisposition = response.headers['content-disposition'];
            let fileName = file.name;
            if (contentDisposition) {
                const match = contentDisposition.match(/filename\*?=([^;]+)/);
                if (match) {
                    let raw = match[1].trim();
                    if (raw.startsWith('"')) raw = raw.slice(1, -1);
                    fileName = decodeURIComponent(raw);
                }
            }
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(downloadUrl);
            message.success('Скачивание начато');
        } catch (error) {
            message.error('Ошибка скачивания');
            console.error(error);
        }
    };

    const handleNavigateToFolder = (targetFolderId) => {
        if (typeof onNavigateToFolder === 'function') {
            onNavigateToFolder(targetFolderId);
        } else {
            message.warning('Навигация недоступна');
        }
    };

    const handleNavigateToElement = (folderId) => {
        if (typeof onNavigateToFolder === 'function') {
            onNavigateToFolder(folderId);
        } else {
            message.warning('Навигация недоступна');
        }
    };

    // === Рендеринг для задачи «Переименовать» ===
    if (task.type === 'rename' && task.details.files) {
        return (
            <div style={{ padding: '8px 0 4px 24px', fontSize: 13, color: '#666', overflowX: 'hidden', maxWidth: '100%' }}>
                <div style={{ marginTop: 8, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500, fontSize: 12, color: '#888', marginBottom: 4 }}>
                        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>Старое имя</div>
                        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>Новое имя</div>
                        <div style={{ width: 80, flexShrink: 0, textAlign: 'center' }}>Статус</div>
                        <div style={{ width: 60, flexShrink: 0, textAlign: 'center' }}>Действие</div>
                    </div>
                    {task.details.files.map((file, index) => {
                        const isSuccess = file.status === 'success';
                        const isError = file.status === 'error';
                        const isSkipped = file.status === 'skipped';
                        let statusText = '⏳ Ожидание';
                        let statusColor = '#666';
                        if (isSuccess) { statusText = '✅ Готово'; statusColor = '#52c41a'; }
                        else if (isError) { statusText = '❌ Ошибка'; statusColor = '#ff4d4f'; }
                        else if (isSkipped) { statusText = '⏭️ Пропущено'; statusColor = '#faad14'; }

                        const canNavigate = isSuccess && file.folderId !== undefined;

                        const TextCell = ({ text }) => (
                            <Tooltip title={text}>
                                <div style={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    wordBreak: 'break-word',
                                    maxHeight: '2.6em',
                                    lineHeight: '1.3em',
                                }}>
                                    {text}
                                </div>
                            </Tooltip>
                        );

                        return (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                                <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                                    <TextCell text={file.oldName} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                                    <TextCell text={file.newName} />
                                </div>
                                <div style={{ width: 80, flexShrink: 0, textAlign: 'center', fontSize: 12, color: statusColor }}>
                                    {statusText}
                                </div>
                                <div style={{ width: 60, flexShrink: 0, textAlign: 'center', fontSize: 16 }}>
                                    {canNavigate && (
                                        <Tooltip title="Перейти к элементу">
                                            <EyeOutlined
                                                style={{ cursor: 'pointer', color: '#52c41a' }}
                                                onClick={() => handleNavigateToElement(file.folderId)}
                                            />
                                        </Tooltip>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // === Рендеринг для остальных типов задач ===
    return (
        <div style={{ padding: '8px 0 4px 24px', fontSize: 13, color: '#666', overflowX: 'hidden', maxWidth: '100%' }}>
            {task.details.message && <div>{task.details.message}</div>}
            {task.details.from && <div>Откуда: {task.details.from}</div>}
            {task.details.to && <div>Куда: {task.details.to}</div>}
            {task.details.oldName && <div>Старое имя: {task.details.oldName}</div>}
            {task.details.newName && <div>Новое имя: {task.details.newName}</div>}

            {task.errorMessage ? (
                <div
                    style={{
                        marginTop: 8,
                        color: '#ff4d4f',
                        fontSize: 12,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: '100%',
                    }}
                >
                    <Tooltip title={task.errorMessage}>
                        <span>Ошибка: {task.errorMessage}</span>
                    </Tooltip>
                </div>
            ) : (
                task.details.links && task.details.links.length > 0 && (
                    <div style={{ marginTop: 8, overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500, fontSize: 12, color: '#888', marginBottom: 4 }}>
                            <div style={{ width: 90, flexShrink: 0, textAlign: 'center' }}>Тип</div>
                            <div style={{ flex: 1, minWidth: 0, textAlign: 'center' }}>Ссылка</div>
                            <div style={{ width: 90, flexShrink: 0, textAlign: 'center' }}>Копировать</div>
                        </div>

                        {task.details.links.map((link, index) => {
                            let linkStr;
                            if (typeof link === 'string') {
                                linkStr = link;
                            } else if (link && typeof link === 'object') {
                                linkStr = link.url || link.link || JSON.stringify(link);
                            } else {
                                linkStr = String(link);
                            }

                            const displayLink = truncateLink(linkStr);

                            return (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                                    <div style={{ width: 90, flexShrink: 0, fontSize: 12, textAlign: 'center' }}>{linkTypeDisplay}</div>
                                    <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12, textAlign: 'center' }}>
                                        <Tooltip title={linkStr}>
                                            <span>{displayLink}</span>
                                        </Tooltip>
                                    </div>
                                    <div style={{ width: 90, flexShrink: 0, textAlign: 'center', fontSize: 12 }}>
                                        <button
                                            onClick={() => handleCopy(linkStr)}
                                            style={{
                                                border: 'none',
                                                background: 'transparent',
                                                cursor: 'pointer',
                                                fontSize: 16,
                                                color: '#1890ff',
                                                padding: 0,
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <CopyOutlined />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )
            )}

            {task.details.files && task.details.files.length > 0 && (
                <div style={{ marginTop: 8, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 500, fontSize: 12, color: '#888', marginBottom: 4 }}>
                        <div style={{ flex: 1, minWidth: 0, textAlign: 'center' }}>Имя</div>
                        <div style={{ width: 90, flexShrink: 0, textAlign: 'center' }}>Статус</div>
                        <div style={{ width: 90, flexShrink: 0, textAlign: 'center' }}>Действие</div>
                    </div>

                    {task.details.files.map((file, index) => {
                        const isFolder = file.type === 'folder' || file.type === 'zip';
                        const canReDownload = file.status === 'success' && file.id && (file.type === 'file' || file.type === 'folder' || file.type === 'zip');
                        const isMoveTask = task.type === 'move';
                        const canNavigate = isMoveTask && file.status === 'success' && task.details.targetFolderId !== undefined;

                        return (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                                <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: 12, textAlign: 'center' }}>
                                    <span>
                                        {isFolder ? <FolderOutlined style={{ color: '#faad14', marginRight: 4 }} /> : <FileOutlined style={{ color: '#1890ff', marginRight: 4 }} />}
                                        {file.oldName || file.name}
                                    </span>
                                </div>
                                <div style={{ width: 90, flexShrink: 0, textAlign: 'center', fontSize: 12 }}>
                                    {file.status === 'success' ? '✅ Готово' : '❌ Ошибка'}
                                </div>
                                <div style={{ width: 90, flexShrink: 0, textAlign: 'center', fontSize: 12 }}>
                                    {canReDownload && (
                                        <Tooltip title="Скачать снова">
                                            <FolderOpenOutlined
                                                style={{ cursor: 'pointer', color: '#1890ff', fontSize: 16 }}
                                                onClick={() => handleReDownload(file)}
                                            />
                                        </Tooltip>
                                    )}
                                    {canNavigate && !canReDownload && (
                                        <Tooltip title="Перейти в папку">
                                            <FolderOutlined
                                                style={{ cursor: 'pointer', color: '#52c41a', fontSize: 16 }}
                                                onClick={() => handleNavigateToFolder(task.details.targetFolderId)}
                                            />
                                        </Tooltip>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};