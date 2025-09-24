import { useMemo, useState } from 'react';
import Avatar from '@/components/ui/Avatar';
import Tooltip from '@/components/ui/Tooltip';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import useMediaCategoryList from '../hooks/useMediaCategoryList';
import cloneDeep from 'lodash/cloneDeep';
import { useNavigate } from 'react-router-dom';
import { TbPencil, TbTrash } from 'react-icons/tb';
import { FaTag } from 'react-icons/fa';
import { apiDeleteMediaCategory } from '@/services/MediaService';
import { Tag } from '@/components/ui';
import { toast } from '@/components/ui/toast';
import Button from '@/components/ui/Button';
import { useAuth } from '@/auth';
import useAuthority from '@/utils/hooks/useAuthority';
import { ADMIN } from '@/constants/roles.constant';

const MediaCategoryColumn = ({ row }) => {
    return (
        <div className="flex items-center gap-2">
            <Avatar
                shape="round"
                size={30}
                icon={<FaTag />}
            />
            <div>
                <div className="font-bold heading-text mb-1">{row.name}</div>
                <Tag className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100">
                    Slug: {row.slug}
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
                <Button
                    size="sm"
                    variant="plain"
                    icon={<TbPencil />}
                    onClick={onEdit}
                />
            </Tooltip>
            {canDelete && (
            <Tooltip title="Delete">
                <Button
                    size="sm"
                    variant="plain"
                    icon={<TbTrash />}
                    onClick={onDelete}
                />
            </Tooltip>
            )}
        </div>
    );
};

const MediaCategoryListTable = () => {
    const navigate = useNavigate();

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [toDeleteId, setToDeleteId] = useState('');

    const handleCancel = () => {
        setDeleteConfirmationOpen(false);
    };

    const handleDelete = (category) => {
        setDeleteConfirmationOpen(true);
        setToDeleteId(category.id);
    };

    const handleEdit = (category) => {
        navigate(`/admin/media/categories/edit/${category.slug}`);
    };

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false);
        try {
            await apiDeleteMediaCategory(toDeleteId);

            mutate();

            setSelectAllMediaCategories([]);
            setToDeleteId('');

            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<FaTag />}
                        className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 mr-2"
                    />
                    <span>Media category deleted successfully.</span>
                </div>
            );
        } catch (error) {
            console.error("Failed to delete media category:", error);
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<FaTag />}
                        className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100 mr-2"
                    />
                    <span>Failed to delete media category. Please try again.</span>
                </div>
            );
            setDeleteConfirmationOpen(false);
        }
    };

    const {
        mediaCategoryList,
        mediaCategoryListTotal,
        mediaCategoryTableData,
        isLoading,
        setMediaCategoryTableData,
        setSelectAllMediaCategories,
        setSelectedMediaCategories,
        selectedMediaCategories,
        mutate,
    } = useMediaCategoryList();

    const columns = useMemo(
        () => [
            {
                header: 'Category',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original;
                    return <MediaCategoryColumn row={row} />;
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
                header: 'Updated At',
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
        [selectedMediaCategories],
    );

    const handleSetTableData = (data) => {
        setMediaCategoryTableData(data);
        if (selectedMediaCategories.length > 0) {
            setSelectAllMediaCategories([]);
        }
    };

    const handlePaginationChange = (page) => {
        const newTableData = cloneDeep(mediaCategoryTableData);
        newTableData.pageIndex = page;
        handleSetTableData(newTableData);
    };

    const handleSelectChange = (value) => {
        const newTableData = cloneDeep(mediaCategoryTableData);
        newTableData.pageSize = Number(value);
        newTableData.pageIndex = 1;
        handleSetTableData(newTableData);
    };

    const handleSort = (sort) => {
        const newTableData = cloneDeep(mediaCategoryTableData);
        newTableData.sort = sort;
        handleSetTableData(newTableData);
    };

    const handleRowSelect = (checked, row) => {
        setSelectedMediaCategories(checked, row);
    };

    const handleAllRowSelect = (checked, rows) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original);
            setSelectAllMediaCategories(originalRows);
        } else {
            setSelectAllMediaCategories([]);
        }
    };

    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={mediaCategoryList}
                noData={!isLoading && mediaCategoryList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 30, height: 30 }}
                loading={isLoading}
                pagingData={{
                    total: mediaCategoryListTotal,
                    pageIndex: mediaCategoryTableData.pageIndex,
                    pageSize: mediaCategoryTableData.pageSize,
                }}
                checkboxChecked={(row) =>
                    selectedMediaCategories.some((selected) => selected.id === row.id)
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
                title="Remove Media Category"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this media category? This action
                    can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default MediaCategoryListTable;