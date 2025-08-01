import { useMemo, useState } from 'react';
import Avatar from '@/components/ui/Avatar';
import Tooltip from '@/components/ui/Tooltip';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import usePageList from '../hooks/usePageList';
import cloneDeep from 'lodash/cloneDeep';
import { useNavigate } from 'react-router-dom';
import { TbPencil, TbTrash, TbEye } from 'react-icons/tb';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { apiDeletePage } from '@/services/PageService';
import { Tag } from '@/components/ui';
import { toast } from '@/components/ui/toast';

const PageColumn = ({ row }) => { 
    const { title, status, featuredImage } = row; 

    return (
        <div className="flex items-center gap-2">
            {featuredImage ? (
                <Avatar
                    shape="round"
                    size={60}
                    src={featuredImage}
                    alt={title}
                />
            ) : (
                <Avatar
                    shape="round"
                    size={60}
                    icon={<HiOutlineDocumentText />}
                />
            )}
            <div>
                <div className="font-bold heading-text mb-1">{title}</div>
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

const ActionColumn = ({ onEdit, onDelete, onViewDetail }) => {
    return (
        <div className="flex items-center justify-end gap-3">
            <Tooltip title="View Detail">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onViewDetail}
                >
                    <TbEye />
                </div>
            </Tooltip>
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
    );
};

const PageListTable = () => { 
    const navigate = useNavigate();

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [toDeleteId, setToDeleteId] = useState('');

    const handleCancel = () => {
        setDeleteConfirmationOpen(false);
    };

    const handleDelete = (page) => { 
        setDeleteConfirmationOpen(true);
        setToDeleteId(page.id);
    };

    const handleEdit = (page) => { 
        navigate(`/admin/pages/edit/${page.slug}`); 
    };

    const handleViewDetail = (page) => { 
        navigate(`/admin/pages/details/${page.slug}`); 
    };

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false);
        try {
            await apiDeletePage(toDeleteId); 

            mutate();
            setSelectAllPages([]);
            setToDeleteId('');
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<HiOutlineDocumentText />}
                        className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 mr-2"
                    />
                    <span>Page deleted successfully.</span>
                </div>
            );
        } catch (error) {
            console.error("Failed to delete page:", error); 
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<HiOutlineDocumentText />}
                        className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100 mr-2"
                    />
                    <span>Failed to delete page. Please try again.</span>
                </div>
            );
            setDeleteConfirmationOpen(false);
        }
    };

    const {
        pageList, 
        pageListTotal, 
        pageTableData, 
        isLoading,
        setPageTableData, 
        setSelectAllPages, 
        selectedPages, 
        setSelectedPages,
        mutate,
    } = usePageList(); 

    const columns = useMemo(
        () => [
            {
                header: 'Title',
                accessorKey: 'title',
                cell: (props) => {
                    const row = props.row.original;
                    return <PageColumn row={row} />; 
                },
            },
            {
                header: 'Author',
                accessorKey: 'author.name',
                cell: (props) => {
                    const { author } = props.row.original;
                    return <span>{author?.name || 'Unknown'}</span>;
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
                        onViewDetail={() => handleViewDetail(props.row.original)}
                        onEdit={() => handleEdit(props.row.original)}
                        onDelete={() => handleDelete(props.row.original)}
                    />
                ),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedPages], 
    );

    const handleSetTableData = (data) => {
        setPageTableData(data); 
        if (selectedPages.length > 0) {
            setSelectAllPages([]);
        }
    };

    const handlePaginationChange = (page) => {
        const newTableData = cloneDeep(pageTableData); 
        newTableData.pageIndex = page;
        handleSetTableData(newTableData);
    };

    const handleSelectChange = (value) => {
        const newTableData = cloneDeep(pageTableData); 
        newTableData.pageSize = Number(value);
        newTableData.pageIndex = 1;
        handleSetTableData(newTableData);
    };

    const handleSort = (sort) => {
        const newTableData = cloneDeep(pageTableData); 
        newTableData.sort = sort;
        handleSetTableData(newTableData);
    };

    const handleRowSelect = (checked, row) => {
        setSelectedPages(checked, row); 
    };

    const handleAllRowSelect = (checked, rows) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original);
            setSelectAllPages(originalRows); 
        } else {
            setSelectAllPages([]); 
        }
    };

    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={pageList} 
                noData={!isLoading && pageList.length === 0} 
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 30, height: 30 }}
                loading={isLoading}
                pagingData={{
                    total: pageListTotal, 
                    pageIndex: pageTableData.pageIndex, 
                    pageSize: pageTableData.pageSize, 
                }}
                checkboxChecked={(row) =>
                    selectedPages.some((selected) => selected.id === row.id) 
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
                title="Remove Page" 
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this page? This action
                    can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default PageListTable;