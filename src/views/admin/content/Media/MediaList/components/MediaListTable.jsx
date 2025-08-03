// src/views/admin/content/Media/MediaList/components/MediaListTable.js

import { useMemo, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import useMediaList from '../hooks/useMediaList'
import cloneDeep from 'lodash/cloneDeep'
import { useNavigate} from 'react-router-dom'
import {
    TbPencil,
    TbTrash,
    TbPhoto,
    TbFileText,
    TbMovie,
    TbHeadphones,
} from 'react-icons/tb'
import { apiDeleteMedia } from '@/services/MediaService'
import { Tag } from '@/components/ui'
import { toast } from '@/components/ui/toast'

const MediaItemColumn = ({ row }) => {
    const getMediaIcon = (type) => {
        switch (type) {
            case 'image':
                return <TbPhoto />
            case 'pdf':
                return <TbFileText />
            case 'video':
                return <TbMovie />
            case 'audio':
                return <TbHeadphones />
            default:
                return <TbPhoto />
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Avatar shape="round" size={30} icon={getMediaIcon(row.type)} />
            <div>
                <div className="font-bold heading-text mb-1">{row.label || row.file_name}</div>
                {row.category_name && (
                    <Tag className="bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100 mr-2">
                        Category: {row.category_name}
                    </Tag>
                )}
                {row.type && (
                    <Tag className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100">
                        Type: {row.type}
                    </Tag>
                )}
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

const MediaListTable = () => {
    const navigate = useNavigate()     
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [toDeleteId, setToDeleteId] = useState('')

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleDelete = (mediaItem) => {
        setDeleteConfirmationOpen(true)
        setToDeleteId(mediaItem.id)
    }

    const handleEdit = (mediaItem) => {
        navigate(`/admin/media/edit/${mediaItem.id}`)
    }

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false)
        try {
            await apiDeleteMedia(toDeleteId)
            mutate()
            setSelectAllMedia([])
            setToDeleteId('')
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<TbPhoto />}
                        className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 mr-2"
                    />
                    <span>Media item deleted successfully!</span>
                </div>,
            )
        } catch (error) {
            console.error('Failed to delete media item:', error)
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<TbPhoto />}
                        className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100 mr-2"
                    />
                    <span>Failed to delete media item. Please try again.</span>
                </div>,
            )
            setDeleteConfirmationOpen(false)
        }
    }

    const {
        mediaList,
        mediaListTotal,
        mediaTableData,
        isLoading,
        setMediaTableData,
        setSelectAllMedia,
        setSelectedMedia,
        selectedMedia,
        mutate,
    } = useMediaList()

    const columns = useMemo(
        () => [
            {
                header: 'Media',
                accessorKey: 'label',
                cell: (props) => {
                    const row = props.row.original
                    return <MediaItemColumn row={row} />
                },
            },
            {
                header: 'Uploaded By',
                accessorKey: 'uploader_name',
                cell: (props) => {
                    const { uploader_name } = props.row.original
                    return <span>{uploader_name}</span>
                },
            },
            {
                header: 'Created At',
                accessorKey: 'created_at',
                cell: (props) => {
                    const { created_at } = props.row.original
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
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedMedia],
    )

    const handleSetTableData = (data) => {
        setMediaTableData(data)
        if (selectedMedia.length > 0) {
            setSelectAllMedia([])
        }
    }

    const handlePaginationChange = (page) => {
        const newTableData = cloneDeep(mediaTableData)
        newTableData.pageIndex = page
        handleSetTableData(newTableData)
    }

    const handleSelectChange = (value) => {
        const newTableData = cloneDeep(mediaTableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        handleSetTableData(newTableData)
    }

    const handleSort = (sort) => {
        const newTableData = cloneDeep(mediaTableData)
        newTableData.sort = sort
        handleSetTableData(newTableData)
    }

    const handleRowSelect = (checked, row) => {
        setSelectedMedia(checked, row)
    }

    const handleAllRowSelect = (checked, rows) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original)
            setSelectAllMedia(originalRows)
        } else {
            setSelectAllMedia([])
        }
    }

    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={mediaList}
                noData={!isLoading && mediaList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 30, height: 30 }}
                loading={isLoading}
                pagingData={{
                    total: mediaListTotal,
                    pageIndex: mediaTableData.pageIndex,
                    pageSize: mediaTableData.pageSize,
                }}
                checkboxChecked={(row) =>
                    selectedMedia.some((selected) => selected.id === row.id)
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
                title="Remove Media Item"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this media item? This action
                    can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default MediaListTable