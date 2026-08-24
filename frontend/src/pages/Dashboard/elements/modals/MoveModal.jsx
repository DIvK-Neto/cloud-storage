import React, { useState, useEffect } from 'react';
import { TreeSelect, Form, message, Space, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { listAllFolders } from '../../../../api/folders/collections/folders';
import { BaseModal } from '../../../../components/ui/all_ui';
import { MoveBulkSettings } from './MoveBulkSettings';
import { MoveBulkTable } from './MoveBulkTable';

const { Text } = Typography;

/**
 * Преобразует плоский список папок в древовидную структуру для TreeSelect
 * @param {Array} folders - массив объектов папок { id, name, parent }
 * @param {Array} excludeIds - массив ID папок, которые нужно исключить (и их дочерние)
 * @returns {Array} дерево папок + корень, отсортированное по имени
 */
const buildTree = (folders, excludeIds = []) => {
    const sortedFolders = [...folders].sort((a, b) => {
        const nameA = a.name || '';
        const nameB = b.name || '';
        return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: 'base' });
    });

    const childrenMap = {};
    sortedFolders.forEach(f => {
        const parent = f.parent || 0;
        if (!childrenMap[parent]) childrenMap[parent] = [];
        childrenMap[parent].push(f.id);
    });

    const getAllDescendants = (id) => {
        let descendants = [];
        const kids = childrenMap[id] || [];
        kids.forEach(kid => {
            descendants.push(kid);
            descendants = descendants.concat(getAllDescendants(kid));
        });
        return descendants;
    };

    let fullExcludeIds = [];
    excludeIds.forEach(id => {
        fullExcludeIds.push(id);
        fullExcludeIds = fullExcludeIds.concat(getAllDescendants(id));
    });
    fullExcludeIds = [...new Set(fullExcludeIds)];

    const rootNode = { id: 0, name: 'Корень', parent: null };
    const map = {};
    map[0] = { ...rootNode, children: [] };

    sortedFolders.forEach(f => {
        if (!fullExcludeIds.includes(f.id)) {
            map[f.id] = { ...f, children: [] };
        }
    });

    const tree = [];
    const allIds = Object.keys(map);
    allIds.forEach(id => {
        const node = map[id];
        if (node.parent) {
            if (map[node.parent]) {
                map[node.parent].children.push(node);
            } else {
                tree.push(node);
            }
        } else {
            tree.push(node);
        }
    });

    if (!tree.find(n => n.id === 0)) {
        tree.push(map[0]);
    }

    const sortChildren = (nodes) => {
        return nodes
            .map(node => ({
                ...node,
                children: node.children && node.children.length > 0 ? sortChildren(node.children) : undefined,
            }))
            .sort((a, b) => {
                const titleA = a.name || '';
                const titleB = b.name || '';
                return titleA.localeCompare(titleB, undefined, { numeric: true, sensitivity: 'base' });
            });
    };

    const formatTree = (nodes) => {
        return sortChildren(nodes).map(node => ({
            value: node.id,
            title: node.name || 'Без имени',
            children: node.children && node.children.length > 0 ? formatTree(node.children) : undefined,
        }));
    };

    return formatTree(tree);
};

export const MoveModal = ({
    visible,
    onClose,
    onCancel,
    onConfirm,
    currentItemId = null,
    currentFolderId = null,
    title = 'Переместить',
    loading = false,
    mode = 'single',
    items = [],
    statuses = {},
    onRemoveItem,
    onUpdateItem,
    showOnlyProblems,
    setShowOnlyProblems,
    conflictRule,
    setConflictRule,
    prefix,
    setPrefix,
    suffix,
    setSuffix,
    applyToAll,
    setApplyToAll,
    individualOverrides = {},
    targetFolderId,
    setTargetFolderId,
    isComplete = false,
    resultStats = null,
}) => {
    const [allFolders, setAllFolders] = useState([]);
    const [treeLoading, setTreeLoading] = useState(false);

    useEffect(() => {
        if (visible) {
            setTreeLoading(true);
            listAllFolders()
                .then(res => {
                    setAllFolders(res.data);
                })
                .catch(err => {
                    console.error('Ошибка загрузки папок для дерева:', err);
                    setAllFolders([]);
                })
                .finally(() => setTreeLoading(false));
        }
    }, [visible]);

    let excludeIds = [];
    if (mode === 'single') {
        if (currentItemId !== null && currentItemId !== undefined) {
            excludeIds = [currentItemId];
        }
    } else if (mode === 'bulk') {
        const selectedFolderIds = items
            .filter(item => item.type === 'folder')
            .map(item => item.id);
        excludeIds = selectedFolderIds;
    }

    const treeData = buildTree(allFolders, excludeIds);

    const handleOk = () => {
        if (mode === 'single') {
            if (targetFolderId === null || targetFolderId === undefined) {
                message.warning('Выберите папку назначения');
                return;
            }
            if (currentFolderId === null && targetFolderId === 0) {
                message.warning('Вы уже находитесь в корневой папке. Выберите другую папку.');
                return;
            }
            if (currentFolderId !== null && targetFolderId === currentFolderId) {
                message.warning('Вы уже находитесь в этой папке. Выберите другую папку.');
                return;
            }
            onConfirm(targetFolderId === 0 ? null : targetFolderId);
        } else {
            onConfirm();
        }
    };

    const renderContent = () => {
        return (
            <>
                <Form layout="vertical" style={{ padding: '0 24px' }}>
                    <Form.Item label="Выберите папку назначения">
                        <TreeSelect
                            placeholder="Выберите папку"
                            treeData={treeData}
                            value={targetFolderId}
                            onChange={setTargetFolderId}
                            style={{ width: '100%' }}
                            treeDefaultExpandAll
                            loading={treeLoading}
                            allowClear
                            disabled={isComplete}
                            styles={{ popup: { maxHeight: 400, overflow: 'auto' } }}
                        />
                    </Form.Item>
                </Form>

                {mode === 'bulk' && (
                    <>
                        <div style={{ padding: '0 24px' }}>
                            <MoveBulkSettings
                                conflictRule={conflictRule}
                                setConflictRule={setConflictRule}
                                prefix={prefix}
                                setPrefix={setPrefix}
                                suffix={suffix}
                                setSuffix={setSuffix}
                                applyToAll={applyToAll}
                                setApplyToAll={setApplyToAll}
                                disabled={isComplete}
                            />
                        </div>

                        <div style={{ padding: '0 24px 24px 24px' }}>
                            <MoveBulkTable
                                items={items}
                                statuses={statuses}
                                onRemoveItem={onRemoveItem}
                                onUpdateItem={onUpdateItem}
                                showOnlyProblems={showOnlyProblems}
                                setShowOnlyProblems={setShowOnlyProblems}
                                targetFolderPath={targetFolderId ? 'целевая_папка' : '/'}
                                conflictRule={conflictRule}
                                prefix={prefix}
                                suffix={suffix}
                                applyToAll={applyToAll}
                                individualOverrides={individualOverrides}
                                isComplete={isComplete}
                            />
                        </div>
                    </>
                )}
            </>
        );
    };

    const actionLabel = isComplete ? 'Готово' : 'Переместить';

    const isActionDisabled = loading ||
        (mode === 'bulk' && !isComplete && (
            targetFolderId === null ||
            (conflictRule === 'rename' && !prefix?.trim() && !suffix?.trim())
        ));

    const handleAction = () => {
        if (isComplete) {
            onClose();
        } else {
            handleOk();
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
            title={title}
            helpText="Выберите папку назначения для перемещения элементов. При конфликте имён можно заменить, переименовать или исключить элемент."
            showFilter={false}
        >
            {renderContent()}
        </BaseModal>
    );
};