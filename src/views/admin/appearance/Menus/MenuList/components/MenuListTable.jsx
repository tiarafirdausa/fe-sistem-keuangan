// src/views/admin/appearance/Menus/MenuList/components/MenuListTable.jsx
import { useMemo, useState } from 'react';
import Avatar from '@/components/ui/Avatar'; 
import Tooltip from '@/components/ui/Tooltip';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import useMenuList from '../hooks/useMenuList'; 
import cloneDeep from 'lodash/cloneDeep';
import { useNavigate } from 'react-router-dom'
import { TbPencil, TbTrash } from 'react-icons/tb';
import { HiOutlineMenu } from 'react-icons/hi'; 
import { apiDeleteMenu } from '@/services/MenuService'; 
import { Tag } from '@/components/ui'; 
import { Button } from '@/components/ui';
import { toast } from '@/components/ui/toast';
import { useAuth } from '@/auth';
import useAuthority from '@/utils/hooks/useAuthority';
import { ADMIN } from '@/constants/roles.constant';

const MenuColumn = ({ row }) => {
    return (
        <div className="flex items-center gap-2">
            <Avatar
                shape="round"
                size={30} 
                icon={<HiOutlineMenu />} 
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

const ActionColumn = ({ onEdit, onDelete, onViewItems }) => {
    const { user } = useAuth();
    const canDelete = useAuthority(user?.role ? [user.role] : [], [ADMIN]);
    return (
        <div className="flex items-center justify-end gap-3">
            <Tooltip title="View Menu Items">
                <Button
                    variant="twoTone"
                    size="sm"
                    onClick={onViewItems}
                >
                    Menu Items
                </Button>
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

const MenuListTable = () => {
    const navigate = useNavigate();

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [toDeleteId, setToDeleteId] = useState('');

    const handleCancel = () => {
        setDeleteConfirmationOpen(false);
    };

    const handleDelete = (menu) => {
        setDeleteConfirmationOpen(true);
        setToDeleteId(menu.id);
    };

    const handleEdit = (menu) => {
        navigate(`/admin/menus/edit/${menu.id}`); 
    };

    const handleViewItems = (menu) => {
        navigate(`/admin/menus/${menu.id}/items`); 
    };

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false);
        try {
            await apiDeleteMenu(toDeleteId);
            mutate(); 
            setSelectAllMenus([]); 
            setToDeleteId('');
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<HiOutlineMenu />}
                        className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 mr-2"
                    />
                    <span>Menu deleted successfully!</span>
                </div>
            );
        } catch (error) {
            console.error("Failed to delete menu:", error);
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<HiOutlineMenu />}
                        className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100 mr-2"
                    />
                    <span>Failed to delete menu. Please try again.</span>
                </div>
            );
            setDeleteConfirmationOpen(false); 
        }
    };

    const {
        menuList,
        menuListTotal,
        menuTableData,
        isLoading,
        setMenuTableData,
        setSelectAllMenus,
        setSelectedMenus,
        selectedMenus,
        mutate,
    } = useMenuList(); 

    const columns = useMemo(
        () => [
            {
                header: 'Menu',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original;
                    return <MenuColumn row={row} />;
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
                        onViewItems={() => handleViewItems(props.row.original)} 
                    />
                ),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedMenus], 
    );

    const handleSetTableData = (data) => {
        setMenuTableData(data);
        if (selectedMenus.length > 0) {
            setSelectAllMenus([]);
        }
    };

    const handlePaginationChange = (page) => {
        const newTableData = cloneDeep(menuTableData);
        newTableData.pageIndex = page;
        handleSetTableData(newTableData);
    };

    const handleSelectChange = (value) => {
        const newTableData = cloneDeep(menuTableData);
        newTableData.pageSize = Number(value);
        newTableData.pageIndex = 1; 
        handleSetTableData(newTableData);
    };

    const handleSort = (sort) => {
        const newTableData = cloneDeep(menuTableData);
        newTableData.sort = sort;
        handleSetTableData(newTableData);
    };

    const handleRowSelect = (checked, row) => {
        setSelectedMenus(checked, row);
    };

    const handleAllRowSelect = (checked, rows) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original);
            setSelectAllMenus(originalRows);
        } else {
            setSelectAllMenus([]);
        }
    };

    return (
        <>
            <DataTable
                selectable 
                columns={columns}
                data={menuList}
                noData={!isLoading && menuList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 30, height: 30 }}
                loading={isLoading}
                pagingData={{
                    total: menuListTotal,
                    pageIndex: menuTableData.pageIndex,
                    pageSize: menuTableData.pageSize,
                }}
                checkboxChecked={(row) =>
                    selectedMenus.some((selected) => selected.id === row.id)
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
                title="Remove Menu" 
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this menu? All associated menu items will also be deleted. This action
                    can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default MenuListTable;