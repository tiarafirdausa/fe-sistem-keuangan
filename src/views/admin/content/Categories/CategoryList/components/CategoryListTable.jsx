// src/views/category/CategoryList/CategoryListTable.jsx
import { useMemo, useState } from 'react';
import Avatar from '@/components/ui/Avatar';
import Tooltip from '@/components/ui/Tooltip';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import useCategoryList from '../hooks/useCategoryList';
import cloneDeep from 'lodash/cloneDeep';
import { useNavigate } from 'react-router-dom';
import { HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import { apiDeleteCategory } from '@/services/CategoryService';
import { toast } from '@/components/ui/toast'; 
import { Tag } from '@/components/ui'; 
import { FaShapes } from 'react-icons/fa';
import { useAuth } from '@/auth';
import useAuthority from '@/utils/hooks/useAuthority';
import { ADMIN } from '@/constants/roles.constant';

const CategoryColumn = ({ row }) => {
    return (
        <div className="flex items-center gap-2">
            <Avatar
                shape="round"
                size={30}
                icon={<FaShapes />} 
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
                    <HiOutlinePencil />
                </div>
            </Tooltip>
            {canDelete && (
            <Tooltip title="Delete">
                <div
                    className={`text-xl cursor-pointer select-none font-semibold`}
                    role="button"
                    onClick={onDelete}
                >
                    <HiOutlineTrash />
                </div>
            </Tooltip>
            )}
        </div>
    );
};

const CategoryListTable = () => {
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
        navigate(`/admin/categories/edit/${category.slug}`); 
    };

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false);
        try {
            await apiDeleteCategory(toDeleteId);
            mutate();
            setSelectAllCategories([]);
            setToDeleteId('');
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<FaShapes />}
                        className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 mr-2"
                    />
                    <span>Category deleted successfully!</span>
                </div>,
                { duration: 3000 }
            );
        } catch (error) {
            console.error("Failed to delete category:", error);
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<FaShapes />}
                        className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100 mr-2"
                    />
                    <span>Failed to delete category. Please try again.</span>
                </div>,
                { duration: 5000 }
            );
            setDeleteConfirmationOpen(false);
        }
    };

    const {
        categoryList,
        categoryListTotal,
        categoryTableData,
        isLoading,
        setCategoryTableData,
        setSelectAllCategories,
        setSelectedCategories,
        selectedCategories,
        mutate,
    } = useCategoryList();

    const columns = useMemo(
        () => [
            {
                header: 'Category',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original;
                    return <CategoryColumn row={row} />;
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
        [selectedCategories],
    );

    const handleSetTableData = (data) => {
        setCategoryTableData(data);
        if (selectedCategories.length > 0) {
            setSelectAllCategories([]);
        }
    };

    const handlePaginationChange = (page) => {
        const newTableData = cloneDeep(categoryTableData);
        newTableData.pageIndex = page;
        handleSetTableData(newTableData);
    };

    const handleSelectChange = (value) => {
        const newTableData = cloneDeep(categoryTableData);
        newTableData.pageSize = Number(value);
        newTableData.pageIndex = 1;
        handleSetTableData(newTableData);
    };

    const handleSort = (sort) => {
        const newTableData = cloneDeep(categoryTableData);
        newTableData.sort = sort;
        handleSetTableData(newTableData);
    };

    const handleRowSelect = (checked, row) => {
        setSelectedCategories(checked, row);
    };

    const handleAllRowSelect = (checked, rows) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original);
            setSelectAllCategories(originalRows);
        } else {
            setSelectAllCategories([]);
        }
    };

    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={categoryList}
                noData={!isLoading && categoryList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 30, height: 30 }}
                loading={isLoading}
                pagingData={{
                    total: categoryListTotal,
                    pageIndex: categoryTableData.pageIndex,
                    pageSize: categoryTableData.pageSize,
                }}
                checkboxChecked={(row) =>
                    selectedCategories.some((selected) => selected.id === row.id)
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
                title="Remove Category"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this category? This action
                    can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default CategoryListTable;