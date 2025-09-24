import { useMemo, useState } from 'react';
import Avatar from '@/components/ui/Avatar';
import Tooltip from '@/components/ui/Tooltip';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import usePostList from '../hooks/usePostList';
import cloneDeep from 'lodash/cloneDeep';
import { useNavigate } from 'react-router-dom';
import { TbPencil, TbTrash } from 'react-icons/tb';
import { apiDeletePost } from '@/services/PostService';
import { Tag } from '@/components/ui';
import { toast } from '@/components/ui/toast';
import { TbArticle } from 'react-icons/tb';
import appConfig from '@/configs/app.config';
import { useAuth } from '@/auth';
import useAuthority from '@/utils/hooks/useAuthority';
import { ADMIN } from '@/constants/roles.constant';

const PostColumn = ({ row }) => {
    const { title, status, category, featured_image } = row;

    const featuredImageUrl = featured_image ? `${appConfig.backendBaseUrl}${featured_image}` : null;

    return (
        <div className="flex items-center gap-2">
            {featuredImageUrl ? (
                <Avatar
                    shape="round"
                    size={60}
                    src={featuredImageUrl}
                    alt={title}
                />
            ) : (
                <Avatar
                    shape="round"
                    size={60}
                    icon={<TbArticle />}
                />
            )}
            <div>
                <div className="font-bold heading-text mb-1">{title}</div>
                <Tag className="bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100">
                    Category: {category?.name || 'N/A'}
                </Tag>
                {status === 'published' && (
                    <Tag className="bg-emerald-100 text-emerald-800 dark:bg-emerald-700 dark:text-emerald-100 ml-1">
                        Published
                    </Tag>
                )}
                {status === 'draft' && (
                    <Tag className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100 ml-1">
                        Draft
                    </Tag>
                )}
                {status === 'archived' && (
                    <Tag className="bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100 ml-1">
                        Archived
                    </Tag>
                )}
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

const PostListTable = () => {
    const navigate = useNavigate();

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [toDeleteId, setToDeleteId] = useState('');

    const handleCancel = () => {
        setDeleteConfirmationOpen(false);
    };

    const handleDelete = (post) => {
        setDeleteConfirmationOpen(true);
        setToDeleteId(post.id);
    };

    const handleEdit = (post) => {
        navigate(`/admin/posts/edit/${post.slug}`);
    };

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false);
        try {
            await apiDeletePost(toDeleteId);

            mutate();
            setSelectAllPosts([]);
            setToDeleteId('');
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<TbArticle />}
                        className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 mr-2"
                    />
                    <span>Successfully deleted the post!</span>
                </div>
            );
        } catch (error) {
            console.error("Failed to delete post:", error);
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<TbArticle />}
                        className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100 mr-2"
                    />
                    <span>Failed to delete the post. Please try again.</span>
                </div>
            );
            setDeleteConfirmationOpen(false);
        }
    };

    const {
        postList,
        postListTotal,
        postTableData,
        isLoading,
        setPostTableData,
        setSelectAllPosts,
        setSelectedPosts,
        selectedPosts,
        mutate,
    } = usePostList();

    const columns = useMemo(
        () => [
            {
                header: 'Title',
                accessorKey: 'title',
                cell: (props) => {
                    const row = props.row.original;
                    return <PostColumn row={row} />;
                },
            },
            {
                header: 'Author',
                accessorKey: 'author_name',
                cell: (props) => {
                    const { author_name } = props.row.original;
                    return <span>{author_name || 'Unknown'}</span>;
                },
            },
            {
                header: 'Published At',
                accessorKey: 'published_at',
                cell: (props) => {
                    const { published_at } = props.row.original;
                    return (
                        <span>
                            {published_at ? new Date(published_at).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            }) : 'N/A'}
                        </span>
                    );
                },
            },
            {
                header: 'Last Modified',
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
        [selectedPosts],
    );

    const handleSetTableData = (data) => {
        setPostTableData(data);
        if (selectedPosts.length > 0) {
            setSelectAllPosts([]);
        }
    };

    const handlePaginationChange = (page) => {
        const newTableData = cloneDeep(postTableData);
        newTableData.pageIndex = page;
        handleSetTableData(newTableData);
    };

    const handleSelectChange = (value) => {
        const newTableData = cloneDeep(postTableData);
        newTableData.pageSize = Number(value);
        newTableData.pageIndex = 1;
        handleSetTableData(newTableData);
    };

    const handleSort = (sort) => {
        const newTableData = cloneDeep(postTableData);
        newTableData.sort = sort;
        handleSetTableData(newTableData);
    };

    const handleRowSelect = (checked, row) => {
        setSelectedPosts(checked, row);
    };

    const handleAllRowSelect = (checked, rows) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original);
            setSelectAllPosts(originalRows);
        } else {
            setSelectAllPosts([]);
        }
    };

    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={postList}
                noData={!isLoading && postList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 30, height: 30 }}
                loading={isLoading}
                pagingData={{
                    total: postListTotal,
                    pageIndex: postTableData.pageIndex,
                    pageSize: postTableData.pageSize,
                }}
                checkboxChecked={(row) =>
                    selectedPosts.some((selected) => selected.id === row.id)
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
                title="Remove Post"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this post? This action
                    can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default PostListTable;