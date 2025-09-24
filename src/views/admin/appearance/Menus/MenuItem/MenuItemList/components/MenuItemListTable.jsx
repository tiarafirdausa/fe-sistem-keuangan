// src/views/admin/appearance/Menus/MenuItems/MenuItemList/components/MenuItemListTable.jsx
import { useMemo, useState } from 'react';
import Avatar from '@/components/ui/Avatar'; 
import Tooltip from '@/components/ui/Tooltip';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import useMenuItemList from '../hooks/useMenuItemList';
import cloneDeep from 'lodash/cloneDeep';
import { useNavigate } from 'react-router-dom'
import { TbPencil, TbTrash } from 'react-icons/tb';
import { HiOutlineLink } from 'react-icons/hi'; 
import { apiDeleteMenuItem } from '@/services/MenuService';
import { Tag } from '@/components/ui'; 
import { toast } from '@/components/ui/toast';
import { useAuth } from '@/auth';
import useAuthority from '@/utils/hooks/useAuthority';
import { ADMIN } from '@/constants/roles.constant';

const MenuItemColumn = ({ row, allMenuItems }) => {
    const parentItem = row.parent_id
        ? allMenuItems.find((item) => item.id === row.parent_id)
        : null;
    const parentTitle = parentItem ? parentItem.title : '';

    return (
        <div className="flex items-center gap-2">
            <Avatar
                shape="round"
                size={30} 
                icon={<HiOutlineLink />} 
            />
            <div>
                <div className="font-bold heading-text mb-1">{row.title}</div>
                {row.type && (
                    <Tag className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100 mr-2">
                        Type: {row.type}
                    </Tag>
                )}
                {row.url && (
                    <Tag className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100">
                        URL: {row.url}
                    </Tag>
                )}
                {parentTitle && (
                    <Tag className="bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100">
                        Sub-item: {parentTitle}
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

const MenuItemListTable = ( {menuId} ) => {
    const navigate = useNavigate();

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [toDeleteId, setToDeleteId] = useState('');

    const handleCancel = () => {
        setDeleteConfirmationOpen(false);
    };

    const handleDelete = (menuItem) => {
        setDeleteConfirmationOpen(true);
        setToDeleteId(menuItem.id);
    };

    const handleEdit = (menuItem) => {
        navigate(`/admin/menus/${menuId}/items/edit/${menuItem.id}`); 
    };

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false);
        try {
            await apiDeleteMenuItem(toDeleteId); 
            mutate();
            setSelectAllMenuItems([]);
            setToDeleteId('');
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<HiOutlineLink />}
                        className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 mr-2"
                    />
                    <span>Menu item deleted successfully!</span>
                </div>
            );
        } catch (error) {
            console.error("Failed to delete menu item:", error);
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<HiOutlineLink />}
                        className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100 mr-2"
                    />
                    <span>Failed to delete menu item. Please try again.</span>
                </div>
            );
            setDeleteConfirmationOpen(false); 
        }
    };

    const {
        menuItemList,
        menuItemListTotal,
        menuItemTableData,
        isLoading,
        setMenuItemTableData,
        setSelectAllMenuItems,
        setSelectedMenuItems,
        selectedMenuItems,
        mutate,
    } = useMenuItemList(menuId);

    const columns = useMemo(
        () => [
            {
                header: 'Menu Item',
                accessorKey: 'title',
                cell: (props) => {
                    const row = props.row.original;
                    return <MenuItemColumn row={row} allMenuItems={menuItemList} />;
                },
            },
            {
                header: 'Order',
                accessorKey: 'order',
                cell: (props) => {
                    const { order } = props.row.original;
                    return <span>{order}</span>;
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
        [selectedMenuItems, menuId], 
    );

    const handleSetTableData = (data) => {
        setMenuItemTableData(data);
        if (selectedMenuItems.length > 0) {
            setSelectAllMenuItems([]);
        }
    };

    const handlePaginationChange = (page) => {
        const newTableData = cloneDeep(menuItemTableData);
        newTableData.pageIndex = page;
        handleSetTableData(newTableData);
    };

    const handleSelectChange = (value) => {
        const newTableData = cloneDeep(menuItemTableData);
        newTableData.pageSize = Number(value);
        newTableData.pageIndex = 1; 
        handleSetTableData(newTableData);
    };

    const handleSort = (sort) => {
        const newTableData = cloneDeep(menuItemTableData);
        newTableData.sort = sort;
        handleSetTableData(newTableData);
    };

    const handleRowSelect = (checked, row) => {
        setSelectedMenuItems(checked, row);
    };

    const handleAllRowSelect = (checked, rows) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original);
            setSelectAllMenuItems(originalRows);
        } else {
            setSelectAllMenuItems([]);
        }
    };

    return (
        <>
            <DataTable
                selectable 
                columns={columns}
                data={menuItemList}
                noData={!isLoading && menuItemList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 30, height: 30 }}
                loading={isLoading}
                pagingData={{
                    total: menuItemListTotal,
                    pageIndex: menuItemTableData.pageIndex,
                    pageSize: menuItemTableData.pageSize,
                }}
                checkboxChecked={(row) =>
                    selectedMenuItems.some((selected) => selected.id === row.id)
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
                title="Remove Menu Item" 
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this menu item? This action
                    can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default MenuItemListTable;