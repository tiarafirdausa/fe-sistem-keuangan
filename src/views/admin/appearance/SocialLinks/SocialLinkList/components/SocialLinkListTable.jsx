import { useMemo, useState } from 'react';
import { DataTable } from '@/components/shared';
import { Avatar, Tooltip, Tag, Badge } from '@/components/ui';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import toast from '@/components/ui/toast';
import useSocialLinkList from '../hooks/useSocialLinkList';
import { apiDeleteSocialLink } from '@/services/SocialLinkService';
import { useNavigate } from 'react-router-dom';
import { TbPencil, TbTrash } from 'react-icons/tb';
import { HiOutlineLink } from 'react-icons/hi';
import cloneDeep from 'lodash/cloneDeep';
import { useAuth } from '@/auth';
import useAuthority from '@/utils/hooks/useAuthority';
import { ADMIN } from '@/constants/roles.constant';

const SocialLinkColumn = ({ row }) => {
    return (
        <div className="flex items-center gap-2">
            <Avatar
                shape="round"
                size={30}
                icon={row.icon_class ? <i className={row.icon_class}></i> : <HiOutlineLink />}
            />
            <div>
                <div className="font-bold heading-text mb-1 capitalize">{row.platform}</div>
                {row.url && (
                    <Tag className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100">
                        URL: <a href={row.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{row.url.length > 30 ? row.url.substring(0, 27) + '...' : row.url}</a>
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

const SocialLinkListTable = () => {
    const navigate = useNavigate();

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [toDeleteId, setToDeleteId] = useState('');

    const handleCancel = () => {
        setDeleteConfirmationOpen(false);
    };

    const handleDelete = (socialLink) => {
        setDeleteConfirmationOpen(true);
        setToDeleteId(socialLink.id);
    };

    const handleEdit = (socialLink) => {
        navigate(`/admin/social-links/edit/${socialLink.id}`);
    };

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false);
        try {
            await apiDeleteSocialLink(toDeleteId);

            mutate();
            setSelectAllSocialLinks([]);
            setToDeleteId('');
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<TbTrash />}
                        className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 mr-2"
                    />
                    <span>Successfully deleted social link!</span>
                </div>
            );
        } catch (error) {
            console.error("Failed to delete social link:", error);
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<TbTrash />}
                        className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100 mr-2"
                    />
                    <span>Failed to delete social link. Please try again.</span>
                </div>
            );
            setDeleteConfirmationOpen(false);
        }
    };

    const {
        socialLinkList,
        socialLinkListTotal,
        socialLinkTableData,
        isLoading,
        mutate,
        setSelectedSocialLinks,
        setSelectAllSocialLinks,
        selectedSocialLinks,
        setSocialLinkTableData, 
    } = useSocialLinkList();

    const handleSetTableData = (data) => {
        setSocialLinkTableData(data);
        if (selectedSocialLinks.length > 0) {
            setSelectAllSocialLinks([]);
        }
    };

    const handlePaginationChange = (page) => {
        const newTableData = cloneDeep(socialLinkTableData);
        newTableData.pageIndex = page;
        handleSetTableData(newTableData);
    };

    const handleSelectChange = (value) => {
        const newTableData = cloneDeep(socialLinkTableData);
        newTableData.pageSize = Number(value);
        newTableData.pageIndex = 1;
        handleSetTableData(newTableData);
    };

    const handleSort = (sort) => {
        const newTableData = cloneDeep(socialLinkTableData);
        newTableData.sort = sort;
        handleSetTableData(newTableData);
    };

    const columns = useMemo(
        () => [
            {
                header: 'Platform',
                accessorKey: 'platform',
                sortable: true,
                cell: (props) => {
                    const row = props.row.original;
                    return <SocialLinkColumn row={row} />;
                },
            },
            {
                header: 'Is Active',
                accessorKey: 'is_active',
                sortable: true,
                cell: (props) => {
                    const { is_active } = props.row.original;
                    return (
                        <Badge
                            className={is_active ? 'bg-emerald-500' : 'bg-red-500'}
                            content={is_active ? 'Active' : 'Inactive'}
                        />
                    );
                },
            },
            {
                header: 'Created At',
                accessorKey: 'created_at',
                sortable: true,
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
                sortable: true,
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
        [selectedSocialLinks, socialLinkList],
    );

    const handleRowSelect = (checked, row) => {
        setSelectedSocialLinks(checked, row);
    };

    const handleAllRowSelect = (checked, rows) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original);
            setSelectAllSocialLinks(originalRows);
        } else {
            setSelectAllSocialLinks([]);
        }
    };

    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={socialLinkList}
                noData={!isLoading && socialLinkList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 30, height: 30 }}
                loading={isLoading}
                pagingData={{
                    total: socialLinkListTotal,
                    pageIndex: socialLinkTableData.pageIndex,
                    pageSize: socialLinkTableData.pageSize,
                }}
                checkboxChecked={(row) =>
                    selectedSocialLinks.some((selected) => selected.id === row.id)
                }
                onPaginationChange={handlePaginationChange} // Changed from onPaginationChange to handlePaginationChange
                onSelectChange={handleSelectChange} // Changed from onPageSizeChange to handleSelectChange
                onSort={handleSort} // Added this
                onCheckBoxChange={handleRowSelect}
                onIndeterminateCheckBoxChange={handleAllRowSelect}
            />
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove Social Link"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this social link? This action
                    can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default SocialLinkListTable;