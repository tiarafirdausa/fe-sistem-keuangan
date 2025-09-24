import { useMemo, useState } from 'react';
import Avatar from '@/components/ui/Avatar'; 
import Tooltip from '@/components/ui/Tooltip';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import useTagList from '../hooks/useTagList';
import cloneDeep from 'lodash/cloneDeep';
import { useNavigate } from 'react-router-dom'
import { TbPencil, TbTrash,TbTag } from 'react-icons/tb';
import { FaTag } from 'react-icons/fa'; 
import { apiDeleteTag } from '@/services/TagService';
import { Tag } from '@/components/ui'; 
import { toast } from '@/components/ui/toast';
import { useAuth } from '@/auth';
import useAuthority from '@/utils/hooks/useAuthority';
import { ADMIN } from '@/constants/roles.constant';

const TagColumn = ({ row }) => {
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

const TagListTable = () => {
    const navigate = useNavigate();

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [toDeleteId, setToDeleteId] = useState('');

    const handleCancel = () => {
        setDeleteConfirmationOpen(false);
    };

    const handleDelete = (tag) => {
        setDeleteConfirmationOpen(true);
        setToDeleteId(tag.id);
    };

    const handleEdit = (tag) => {
        navigate(`/admin/tags/edit/${tag.slug}`);
    };

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false);
        try {
            await apiDeleteTag(toDeleteId);

            mutate();

            setSelectAllTags([]); 
            setToDeleteId('');

            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<TbTag />} 
                        className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 mr-2"
                    />
                    <span>Tag deleted successfully.</span>
                </div>
            );
        } catch (error) {
            console.error("Failed to delete tag:", error);
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<TbTag />}
                        className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100 mr-2"
                    />
                    <span>Failed to delete tag. Please try again.</span>
                </div>
            );
            setDeleteConfirmationOpen(false); 
        }
    };
    const {
        tagList,
        tagListTotal,
        tagTableData,
        isLoading,
        setTagTableData,
        setSelectAllTags,
        setSelectedTags,
        selectedTags,
        mutate,
    } = useTagList();

    const columns = useMemo(
        () => [
            {
                header: 'Tag',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original;
                    return <TagColumn row={row} />;
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
        [selectedTags], 
    );

    const handleSetTableData = (data) => {
        setTagTableData(data);
        if (selectedTags.length > 0) {
            setSelectAllTags([]);
        }
    };

    const handlePaginationChange = (page) => {
        const newTableData = cloneDeep(tagTableData);
        newTableData.pageIndex = page;
        handleSetTableData(newTableData);
    };

    const handleSelectChange = (value) => {
        const newTableData = cloneDeep(tagTableData);
        newTableData.pageSize = Number(value);
        newTableData.pageIndex = 1; 
        handleSetTableData(newTableData);
    };

    const handleSort = (sort) => {
        const newTableData = cloneDeep(tagTableData);
        newTableData.sort = sort;
        handleSetTableData(newTableData);
    };

    const handleRowSelect = (checked, row) => {
        setSelectedTags(checked, row);
    };

    const handleAllRowSelect = (checked, rows) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original);
            setSelectAllTags(originalRows);
        } else {
            setSelectAllTags([]);
        }
    };

    return (
        <>
            <DataTable
                selectable 
                columns={columns}
                data={tagList}
                noData={!isLoading && tagList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 30, height: 30 }}
                loading={isLoading}
                pagingData={{
                    total: tagListTotal,
                    pageIndex: tagTableData.pageIndex,
                    pageSize: tagTableData.pageSize,
                }}
                checkboxChecked={(row) =>
                    selectedTags.some((selected) => selected.id === row.id)
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
                title="Remove Tag" 
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this tag? This action
                    can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default TagListTable;