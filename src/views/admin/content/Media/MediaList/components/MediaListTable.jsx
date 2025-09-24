// src/views/admin/content/Media/MediaList/MediaListTable.jsx

import { useMemo, useState } from 'react';
import Avatar from '@/components/ui/Avatar';
import Tooltip from '@/components/ui/Tooltip';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import useMediaList from '../hooks/useMediaList';
import cloneDeep from 'lodash/cloneDeep';
import { useNavigate } from 'react-router-dom';
import { TbPencil, TbTrash } from 'react-icons/tb';
import { MdOutlinePermMedia } from 'react-icons/md';
import { apiDeleteMediaCollection } from '@/services/MediaService';
import { toast } from '@/components/ui/toast';
import appConfig from '@/configs/app.config';
import { Tag } from '@/components/ui';
import { useAuth } from '@/auth';
import useAuthority from '@/utils/hooks/useAuthority';
import { ADMIN } from '@/constants/roles.constant';

// Change this component to use featured_image
const MediaColumn = ({ row }) => {
    const { title, featured_image } = row;

    const renderMediaPreview = () => {
        if (!featured_image) {
            return (
                <Avatar shape="round" size={60} icon={<MdOutlinePermMedia />} />
            );
        }

        const imageUrl = `${appConfig.backendBaseUrl}${featured_image}`;
        return <Avatar shape="round" size={60} src={imageUrl} alt={title} />;
    };

    return (
        <div className="flex items-center gap-2">
            {renderMediaPreview()}
            <div>
                <div className="font-bold heading-text mb-1">{title}</div>
                <Tag className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100">
                    Category: {row.category_name}
                </Tag>
            </div>
        </div>
    );
};

const ActionColumn = ({ onEdit, onDelete }) => {
    const { user } = useAuth();
    const canDelete = useAuthority(user?.role ? [user.role] : [], [ADMIN]);
    return (
        <div className="flex items-center justify-end gap-3">
            <Tooltip title="Edit">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onEdit}
                >
                    <TbPencil />
                </div>
            </Tooltip>
            {canDelete && (
            <Tooltip title="Delete">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onDelete}
                >
                    <TbTrash />
                </div>
            </Tooltip>
            )}
        </div>
    );
};

const MediaListTable = () => {
    const navigate = useNavigate();
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [toDeleteId, setToDeleteId] = useState('');

    const handleCancel = () => {
        setDeleteConfirmationOpen(false);
    };

    const handleDelete = (collection) => {
        setDeleteConfirmationOpen(true);
        setToDeleteId(collection.id);
    };

    const handleEdit = (collection) => {
        navigate(`/admin/media/edit/${collection.id}`);
    };

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false);
        try {
            await apiDeleteMediaCollection(toDeleteId);

            mutate();
            setSelectAllMediaCollections([]);
            setToDeleteId('');
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<MdOutlinePermMedia />}
                        className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 mr-2"
                    />
                    <span>Media collection deleted successfully.</span>
                </div>,
            );
        } catch (error) {
            console.error('Failed to delete media collection:', error);
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<MdOutlinePermMedia />}
                        className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100 mr-2"
                    />
                    <span>
                        Failed to delete media collection. Please try again.
                    </span>
                </div>,
            );
            setDeleteConfirmationOpen(false);
        }
    };

    const {
        mediaCollectionList,
        mediaListTotal,
        mediaTableData,
        isLoading,
        setMediaTableData,
        setSelectAllMediaCollections,
        selectedMediaCollections,
        setSelectedMediaCollections,
        mutate,
    } = useMediaList();

    const columns = useMemo(
        () => [
            {
                header: 'Title',
                accessorKey: 'title',
                cell: (props) => {
                    const row = props.row.original;
                    return <MediaColumn row={row} />;
                },
            },
            {
                header: 'Files',
                accessorKey: 'media',
                cell: (props) => {
                    const { media } = props.row.original;
                    return <span>{media?.length || 0}</span>;
                },
            },
            {
                header: 'Uploader',
                accessorKey: 'uploaded_by_user.name',
                cell: (props) => {
                    const { uploaded_by_user } = props.row.original;
                    return <span>{uploaded_by_user?.name || 'Unknown'}</span>;
                },
            },
            {
                header: 'Created At',
                accessorKey: 'created_at',
                cell: (props) => {
                    const { created_at } = props.row.original;
                    return (
                        <span>
                            {new Date(created_at).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                    );
                },
            },
            {
                header: 'Update At',
                accessorKey: 'updated_at',
                cell: (props) => {
                    const { updated_at } = props.row.original;
                    return (
                        <span>
                            {new Date(updated_at).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                    );
                },
            },
            {
                header: '',
                id: 'action',
                cell: (props) => (
                    <ActionColumn
                        onEdit={() => handleEdit(props.row.original)}
                        onDelete={() => handleDelete(props.row.original)}
                    />
                ),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedMediaCollections],
    );

    const handleSetTableData = (data) => {
        setMediaTableData(data);
        if (selectedMediaCollections.length > 0) {
            setSelectAllMediaCollections([]);
        }
    };

    const handlePaginationChange = (page) => {
        const newTableData = cloneDeep(mediaTableData);
        newTableData.pageIndex = page;
        handleSetTableData(newTableData);
    };

    const handleSelectChange = (value) => {
        const newTableData = cloneDeep(mediaTableData);
        newTableData.pageSize = Number(value);
        newTableData.pageIndex = 1;
        handleSetTableData(newTableData);
    };

    const handleSort = (sort) => {
        const newTableData = cloneDeep(mediaTableData);
        newTableData.sort = sort;
        handleSetTableData(newTableData);
    };

    const handleRowSelect = (checked, row) => {
        setSelectedMediaCollections(checked, row);
    };

    const handleAllRowSelect = (checked, rows) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original);
            setSelectAllMediaCollections(originalRows);
        } else {
            setSelectAllMediaCollections([]);
        }
    };

    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={mediaCollectionList}
                noData={!isLoading && mediaCollectionList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 30, height: 30 }}
                loading={isLoading}
                pagingData={{
                    total: mediaListTotal,
                    pageIndex: mediaTableData.pageIndex,
                    pageSize: mediaTableData.pageSize,
                }}
                checkboxChecked={(row) =>
                    selectedMediaCollections.some(
                        (selected) => selected.id === row.id,
                    )
                }
                onPaginationChange={handlePaginationChange}
                onSelectChange={handleSelectChange}
                onSort={handleSort}
                onCheckBoxChange={handleRowSelect}
                onIndeterminateCheckBoxChange={handleAllRowSelect}
            />
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove Media Collection"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this media collection? This
                    action can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default MediaListTable;