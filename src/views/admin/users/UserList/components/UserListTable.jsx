// src/views/content/Users/UserList/components/UserListTable.jsx
import { useMemo, useState } from 'react';
import Avatar from '@/components/ui/Avatar';
import Tooltip from '@/components/ui/Tooltip';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import useUserList from '../hooks/useUserList';
import cloneDeep from 'lodash/cloneDeep';
import { useNavigate } from 'react-router-dom';
import { TbPencil, TbTrash, TbUser } from 'react-icons/tb';
import { apiDeleteUser } from '@/services/UserService';
import { Tag } from '@/components/ui';
import { toast } from '@/components/ui/toast';
import appConfig from '@/configs/app.config';

// Helper function to format date
const formatDate = (dateString) => {
    if (!dateString) {
        return 'N/A';
    }
    const date = new Date(dateString);
    if (isNaN(date)) {
        return 'Invalid Date';
    }
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const UserColumn = ({ row }) => {
    const { name, role, status, foto } = row;

    const imageUrl = foto ? `${appConfig.backendBaseUrl}${foto}` : null;

    return (
        <div className="flex items-center gap-2">
            {imageUrl ? (
                <Avatar
                    shape="circle"
                    size={40}
                    src={imageUrl}
                    alt={name}
                />
            ) : (
                <Avatar
                    shape="circle"
                    size={40}
                    icon={<TbUser />}
                />
            )}
            <div>
                <div className="font-bold heading-text mb-1">{name}</div>
                <Tag className="bg-blue-100 text-blue-800 dark:bg-blue-700 dark:text-blue-100">
                    Role: {role || 'N/A'}
                </Tag>
                {status === 'active' && (
                    <Tag className="bg-emerald-100 text-emerald-800 dark:bg-emerald-700 dark:text-emerald-100 ml-1">
                        Active
                    </Tag>
                )}
                {status === 'suspended' && (
                    <Tag className="bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100 ml-1">
                        Suspended
                    </Tag>
                )}
            </div>
        </div>
    );
};

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
    );
};

const UserListTable = () => {
    const navigate = useNavigate();

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [toDeleteId, setToDeleteId] = useState('');

    const handleCancel = () => {
        setDeleteConfirmationOpen(false);
    };

    const handleDelete = (user) => {
        setDeleteConfirmationOpen(true);
        setToDeleteId(user.id);
    };

    const handleEdit = (user) => {
        navigate(`/admin/users/edit/${user.id}`);
    };

    const handleConfirmDelete = async () => {
        try {
            await apiDeleteUser(toDeleteId);

            mutate();
            setSelectAllUsers([]);

            setDeleteConfirmationOpen(false);
            setToDeleteId('');

            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<TbUser />}
                        className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 mr-2"
                    />
                    <span>Successfully deleted user!</span>
                </div>
            );
        } catch (error) {
            console.error("Failed to delete user:", error);
            setDeleteConfirmationOpen(false);
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<TbUser />}
                        className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100 mr-2"
                    />
                    <span>Failed to delete user. Please try again.</span>
                </div>
            );
        }
    };

    const {
        userList,
        userListTotal,
        userTableData,
        isLoading,
        setUserTableData,
        setSelectAllUsers,
        setSelectedUsers,
        selectedUsers,
        mutate,
    } = useUserList();

    const columns = useMemo(
        () => [
            {
                header: 'User Info',
                accessorKey: 'name',
                cell: (props) => {
                    const row = props.row.original;
                    return <UserColumn row={row} />;
                },
            },
            {
                header: 'Email',
                accessorKey: 'email',
            },
            {
                header: 'Username',
                accessorKey: 'username',
            },
            {
                header: 'Created At',
                accessorKey: 'created_at',
                cell: (props) => {
                    const { created_at } = props.row.original;
                    return (
                        <span>{formatDate(created_at)}</span>
                    );
                },
            },
            {
                header: 'Last Modified',
                accessorKey: 'updated_at',
                cell: (props) => {
                    const { updated_at } = props.row.original;
                    return (
                        <span>{formatDate(updated_at)}</span>
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
        [selectedUsers],
    );

    const handleSetTableData = (data) => {
        setUserTableData(data);
        if (selectedUsers.length > 0) {
            setSelectAllUsers([]);
        }
    };

    const handlePaginationChange = (page) => {
        const newTableData = cloneDeep(userTableData);
        newTableData.pageIndex = page;
        handleSetTableData(newTableData);
    };

    const handleSelectChange = (value) => {
        const newTableData = cloneDeep(userTableData);
        newTableData.pageSize = Number(value);
        newTableData.pageIndex = 1;
        handleSetTableData(newTableData);
    };

    const handleSort = (sort) => {
        const newTableData = cloneDeep(userTableData);
        newTableData.sort = sort;
        handleSetTableData(newTableData);
    };

    const handleRowSelect = (checked, row) => {
        setSelectedUsers(checked, row);
    };

    const handleAllRowSelect = (checked, rows) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original);
            setSelectAllUsers(originalRows);
        } else {
            setSelectAllUsers([]);
        }
    };

    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={userList}
                noData={!isLoading && userList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 40, height: 40, shape: 'circle' }}
                loading={isLoading}
                pagingData={{
                    total: userListTotal,
                    pageIndex: userTableData.pageIndex,
                    pageSize: userTableData.pageSize,
                }}
                checkboxChecked={(row) =>
                    selectedUsers.some((selected) => selected.id === row.id)
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
                title="Remove User"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this user? This action
                    can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default UserListTable;