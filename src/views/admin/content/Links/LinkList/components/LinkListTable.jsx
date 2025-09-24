import { useMemo, useState } from 'react'
import Avatar from '@/components/ui/Avatar'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import useLinkList from '../hooks/useLinkList'
import cloneDeep from 'lodash/cloneDeep'
import { useNavigate } from 'react-router-dom'
import { TbPencil, TbTrash } from 'react-icons/tb'
import { HiOutlineLink } from 'react-icons/hi'
import { apiDeleteLink } from '@/services/LinkService'
import { toast } from '@/components/ui/toast'
import { Tag } from '@/components/ui'
import appConfig from '@/configs/app.config'
import { useAuth } from '@/auth';
import useAuthority from '@/utils/hooks/useAuthority';
import { ADMIN } from '@/constants/roles.constant';

const LinkColumn = ({ row }) => {
    const { judul, gambar } = row
    const gambarUrl = gambar ? `${appConfig.backendBaseUrl}${gambar}` : null // <-- Variabel 'iconUrl' diganti 'gambarUrl'

    return (
        <div className="flex items-center gap-2">
            {gambarUrl ? (
                <Avatar shape="round" size={60} src={gambarUrl} alt={judul} />
            ) : (
                <Avatar shape="round" size={60} icon={<HiOutlineLink />} />
            )}
            <div>
                <div className="font-bold heading-text mb-1">{judul}</div>
                <Tag className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100">
                    Category: {row.kategori}
                </Tag>
            </div>
        </div>
    )
}

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
    )
}

const LinkListTable = () => {
    const navigate = useNavigate()

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [toDeleteId, setToDeleteId] = useState('')

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleDelete = (link) => {
        setDeleteConfirmationOpen(true)
        setToDeleteId(link.id)
    }

    const handleEdit = (link) => {
        navigate(`/admin/links/edit/${link.id}`)
    }

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false)
        try {
            await apiDeleteLink(toDeleteId)
            mutate()
            setSelectAllLinks([])
            setToDeleteId('')
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<HiOutlineLink />}
                        className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 mr-2"
                    />
                    <span>Link deleted successfully.</span>
                </div>,
            )
        } catch (error) {
            console.error('Failed to delete link:', error)
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<HiOutlineLink />}
                        className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100 mr-2"
                    />
                    <span>Failed to delete link. Please try again.</span>
                </div>,
            )
            setDeleteConfirmationOpen(false)
        }
    }

    const {
        linkList,
        linkListTotal,
        linkTableData,
        isLoading,
        setLinkTableData,
        setSelectedLinks,
        setSelectAllLinks,
        selectedLinks,
        mutate,
    } = useLinkList()

    const columns = useMemo(
        () => [
            {
                header: 'Title',
                accessorKey: 'judul',
                cell: (props) => {
                    const row = props.row.original
                    return <LinkColumn row={row} />
                },
            },
            {
                header: 'URL',
                accessorKey: 'link', // <-- Diperbaiki dari 'url' menjadi 'link'
                cell: (props) => {
                    const { link } = props.row.original // <-- Diperbaiki dari 'url' menjadi 'link'
                    return (
                        <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {link}
                        </a>
                    )
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
                header: 'Last Modified',
                accessorKey: 'updated_at',
                cell: (props) => {
                    const { updated_at } = props.row.original
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
        [],
    )

    const handleSetTableData = (data) => {
        setLinkTableData(data)
        if (selectedLinks.length > 0) {
            setSelectAllLinks([])
        }
    }

    const handlePaginationChange = (page) => {
        const newTableData = cloneDeep(linkTableData)
        newTableData.pageIndex = page
        handleSetTableData(newTableData)
    }

    const handleSelectChange = (value) => {
        const newTableData = cloneDeep(linkTableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        handleSetTableData(newTableData)
    }

    const handleSort = (sort) => {
        const newTableData = cloneDeep(linkTableData)
        newTableData.sort = sort
        handleSetTableData(newTableData)
    }

    const handleRowSelect = (checked, row) => {
        setSelectedLinks(checked, row)
    }

    const handleAllRowSelect = (checked, rows) => {
        if (checked) {
            const originalRows = rows.map((row) => row)
            setSelectAllLinks(originalRows) 
        } else {
            setSelectAllLinks([]) 
        }
    }

    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={linkList}
                noData={!isLoading && linkList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 30, height: 30 }}
                loading={isLoading}
                pagingData={{
                    total: linkListTotal,
                    pageIndex: linkTableData.pageIndex,
                    pageSize: linkTableData.pageSize,
                }}
                checkboxChecked={(row) =>
                    selectedLinks.some((selected) => selected.id === row.id)
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
                title="Remove Link"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this link? This action
                    can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default LinkListTable
