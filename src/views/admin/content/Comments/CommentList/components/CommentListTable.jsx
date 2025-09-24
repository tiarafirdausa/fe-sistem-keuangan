import { useMemo, useState } from 'react';
import Avatar from '@/components/ui/Avatar';
import Tooltip from '@/components/ui/Tooltip';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import useCommentList from '../hooks/useCommentList';
import cloneDeep from 'lodash/cloneDeep';
import { TbTrash } from 'react-icons/tb';
import { HiOutlineChatAlt2 } from 'react-icons/hi';
import { apiDeleteComment, apiUpdateCommentStatus } from '@/services/CommentService';
import { Tag } from '@/components/ui';
import { toast } from '@/components/ui/toast';
import { TbCheck, TbX } from 'react-icons/tb';
import Notification from '@/components/template/Notification';
import { useAuth } from '@/auth';
import useAuthority from '@/utils/hooks/useAuthority';
import { ADMIN } from '@/constants/roles.constant';

const CommentColumn = ({ row }) => { 
    const { author_name, status } = row; 

    const statusTagColor = {
        'approved': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-700 dark:text-emerald-100',
        'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100',
        'spam': 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100',
    };

    const statusText = {
        'approved': 'Approved',
        'pending': 'Pending',
        'spam': 'Spam',
    };

    return (
        <div className="flex items-center gap-2">
            <Avatar
                shape="round"
                size={30}
                icon={<HiOutlineChatAlt2 />}
            />
            <div>
                <div className="font-bold heading-text mb-1">{author_name}</div>
                <Tag className={`${statusTagColor[status]} mt-1`}>
                    {statusText[status]}
                </Tag>
            </div>
        </div>
    );
};

const ActionColumn = ({ onDelete, onUpdateStatus, row  }) => {
    const { status } = row;
    const showStatusButtons = status === 'pending';
    const { user } = useAuth();
    const canDelete = useAuthority(user?.role ? [user.role] : [], [ADMIN]);

    return (
        <div className="flex items-center justify-end gap-3">
            {showStatusButtons && (
                <>
                    <Tooltip title="Approve Comment">
                        <div
                            className={`text-xl cursor-pointer select-none font-semibold text-emerald-500`}
                            role="button"
                            onClick={() => onUpdateStatus(row.id, 'approved')}
                        >
                            <TbCheck />
                        </div>
                    </Tooltip>
                    <Tooltip title="Mark as Spam">
                        <div
                            className={`text-xl cursor-pointer select-none font-semibold text-red-500`}
                            role="button"
                            onClick={() => onUpdateStatus(row.id, 'spam')}
                        >
                            <TbX />
                        </div>
                    </Tooltip>
                </>
            )}
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

const CommentListTable = () => { 
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [toDeleteId, setToDeleteId] = useState('');

    const handleCancel = () => {
        setDeleteConfirmationOpen(false);
    };

    const handleDelete = (comment) => { 
        setDeleteConfirmationOpen(true);
        setToDeleteId(comment.id);
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await apiUpdateCommentStatus(id, { status });
            mutate(); // Memuat ulang data setelah sukses
            toast.push(
                <Notification type="success" title="Success">
                    Comment status updated to **{status}** successfully!
                </Notification>,
                { placement: 'top-center' },
            );
        } catch (error) {
            console.error("Failed to update comment status:", error);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to update comment status. Please try again.
                </Notification>,
                { placement: 'top-center' },
            );
        }
    };

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false);
        try {
            await apiDeleteComment(toDeleteId); 

            mutate(); 
            setSelectAllComments([]); 
            setToDeleteId('');
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<HiOutlineChatAlt2 />}
                        className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 mr-2"
                    />
                    <span>Comment deleted successfully.</span>
                </div>
            );
        } catch (error) {
            console.error("Failed to delete comment.:", error); 
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<HiOutlineChatAlt2 />}
                        className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100 mr-2"
                    />
                    <span>Failed to delete comment. Please try again.</span>
                </div>
            );
            setDeleteConfirmationOpen(false);
        }
    };

    const {
        commentList, 
        commentListTotal, 
        commentTableData, 
        isLoading,
        setCommentTableData, 
        setSelectAllComments, 
        selectedComments, 
        setSelectedComments,
        mutate,
    } = useCommentList(); 

    const columns = useMemo(
        () => [
            {
                header: 'Author',
                accessorKey: 'author_name',
                cell: (props) => {
                    const row = props.row.original;
                    return <CommentColumn row={row} />; 
                },
            },
            {
                header: 'Content',
                accessorKey: 'content',
                cell: (props) => {
                    const { content } = props.row.original;
                    return (
                        <Tooltip title={content}>
                            <div className="line-clamp-2">{content}</div>
                        </Tooltip>
                    );
                },
            },
            {
                header: 'Post Title',
                accessorKey: 'post_title',
                cell: (props) => {
                    const { post_title } = props.row.original;
                    return <span>{post_title || 'N/A'}</span>;
                },
            },
            {
                header: 'Created At',
                accessorKey: 'created_at',
                cell: (props) => {
                    const { created_at } = props.row.original;
                    return (
                        <span>
                            {new Date(created_at).toLocaleString('id-ID', {
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
                        row={props.row.original} 
                        onDelete={() => handleDelete(props.row.original)}
                        onUpdateStatus={handleUpdateStatus}
                    />
                ),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedComments], 
    );

    const handleSetTableData = (data) => {
        setCommentTableData(data); 
        if (selectedComments.length > 0) {
            setSelectAllComments([]);
        }
    };

    const handlePaginationChange = (page) => {
        const newTableData = cloneDeep(commentTableData); 
        newTableData.pageIndex = page;
        handleSetTableData(newTableData);
    };

    const handleSelectChange = (value) => {
        const newTableData = cloneDeep(commentTableData); 
        newTableData.pageSize = Number(value);
        newTableData.pageIndex = 1;
        handleSetTableData(newTableData);
    };

    const handleSort = (sort) => {
        const newTableData = cloneDeep(commentTableData); 
        newTableData.sort = sort;
        handleSetTableData(newTableData);
    };

    const handleRowSelect = (checked, row) => {
        setSelectedComments(checked, row); 
    };

    const handleAllRowSelect = (checked, rows) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original);
            setSelectAllComments(originalRows); 
        } else {
            setSelectAllComments([]); 
        }
    };

    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={commentList} 
                noData={!isLoading && commentList.length === 0} 
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 30, height: 30 }}
                loading={isLoading}
                pagingData={{
                    total: commentListTotal, 
                    pageIndex: commentTableData.pageIndex, 
                    pageSize: commentTableData.pageSize, 
                }}
                checkboxChecked={(row) =>
                    selectedComments.some((selected) => selected.id === row.id) 
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
                title="Hapus Komentar" 
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this commnet? This action
                    can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default CommentListTable;
