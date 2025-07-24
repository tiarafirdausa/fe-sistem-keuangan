import { useMemo, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import usePostList from '../hooks/usePostList'
import classNames from '@/utils/classNames'
import cloneDeep from 'lodash/cloneDeep'
import { useNavigate } from 'react-router'
import { TbPencil, TbTrash } from 'react-icons/tb'
import { FiFileText } from 'react-icons/fi'
import { apiDeletePost } from '@/services/PostService'
import { toast } from '@/components/ui/toast'

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const PostColumn = ({ row }) => {
    return (
        <div className="flex items-center gap-2">
            <Avatar
                shape="round"
                size={60}
                {...(row.featured_image ? { src: row.featured_image } : { icon: <FiFileText /> })}
            />
            <div>
                <div className="font-bold heading-text mb-1">{row.title}</div>
                {row.slug && <span className="text-sm text-gray-500">Slug: {row.slug}</span>}
            </div>
        </div>
    )
}

const ActionColumn = ({ onEdit, onDelete }) => {
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
            <Tooltip title="Delete">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onDelete}
                >
                    <TbTrash />
                </div>
            </Tooltip>
        </div>
    )
}

const PostListTable = () => {
    const navigate = useNavigate()

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [toDeleteId, setToDeleteId] = useState('')

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleDelete = (post) => { 
        setDeleteConfirmationOpen(true)
        setToDeleteId(post.id)
    }

    const handleEdit = (post) => { 
        navigate(`/admin/posts/edit/${post.id}`) 
    }

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false)
        try {
            await apiDeletePost(toDeleteId) 
            mutate() 
            toast.push(
                <div className="flex items-center">
                    <Avatar shape="circle" icon={<FiFileText />} className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 mr-2"/>
                    <span>Post deleted successfully!</span>
                </div>
            )
            setToDeleteId('')
            setSelectAllPost([]) 
        } catch (error) {
            console.error("Error deleting post:", error);
            toast.push(
                <div className="flex items-center">
                    <Avatar shape="circle" icon={<FiFileText />} className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100 mr-2"/>
                    <span>Failed to delete post. Please try again.</span>
                </div>
            )
        }
    }

    const {
        postList, 
        postListTotal, 
        tableData,
        isLoading,
        setTableData,
        setSelectAllPost, 
        setSelectedPost, 
        selectedPost, 
        mutate,
    } = usePostList() 

    const columns = useMemo(
        () => [
            {
                header: 'Post',
                accessorKey: 'title',
                cell: (props) => {
                    const row = props.row.original
                    return <PostColumn row={row} />
                },
            },
            {
                header: 'Author',
                accessorKey: 'author_name', 
                cell: (props) => {
                    const { author_name } = props.row.original
                    return (
                        <span className="font-semibold heading-text">
                            {author_name || 'N/A'}
                        </span>
                    )
                },
            },
            {
                header: 'Status',
                accessorKey: 'status',
                cell: (props) => {
                    const { status } = props.row.original
                    const statusColorClass = {
                        published: 'bg-emerald-500',
                        draft: 'bg-amber-400',
                        archived: 'bg-red-500',
                    }[status] || 'bg-gray-400';
                    return (
                        <span className={classNames(
                            'capitalize font-semibold px-2 py-0.5 rounded-full text-white text-xs',
                            statusColorClass
                        )}>
                            {status}
                        </span>
                    );
                },
            },
            {
                header: 'Published At',
                accessorKey: 'published_at',
                cell: (props) => {
                    const { published_at } = props.row.original
                    return (
                        <span>
                            {formatDate(published_at)}
                        </span>
                    )
                },
            },
            {
                header: 'Categories',
                accessorKey: 'categories',
                cell: (props) => {
                    const { categories } = props.row.original
                    return (
                        <div>
                            {categories && categories.length > 0
                                ? categories.map((cat,) => (
                                      <span key={cat.id} className="text-sm px-1 py-0.5 mr-1 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                                          {cat.name}
                                      </span>
                                  ))
                                : 'N/A'}
                        </div>
                    )
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
        ], // eslint-disable-next-line react-hooks/exhaustive-deps
        [], 
    )

    const handleSetTableData = (data) => {
        setTableData(data)
        if (selectedPost.length > 0) {
            setSelectAllPost([])
        }
    }

    const handlePaginationChange = (page) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        handleSetTableData(newTableData)
    }

    const handleSelectChange = (value) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        handleSetTableData(newTableData)
    }

    const handleSort = (sort) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        handleSetTableData(newTableData)
    }

    const handleRowSelect = (checked, row) => {
        setSelectedPost(checked, row)
    }

    const handleAllRowSelect = (checked, rows) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllPost(originalRows)
        } else {
            setSelectAllPost([])
        }
    }

    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={postList}
                noData={!isLoading && postList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 28, height: 28 }}
                loading={isLoading}
                pagingData={{
                    total: postListTotal,
                    pageIndex: tableData.pageIndex,
                    pageSize: tableData.pageSize,
                }}
                checkboxChecked={(row) =>
                    selectedPost.some((selected) => selected.id === row.id)
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
    )
}

export default PostListTable