import { useMemo, useState } from 'react';
import Avatar from '@/components/ui/Avatar';
import Tooltip from '@/components/ui/Tooltip';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import useBannerList from '../hooks/useBannerList';
import cloneDeep from 'lodash/cloneDeep';
import { useNavigate } from 'react-router-dom';
import { TbPencil, TbTrash } from 'react-icons/tb';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { apiDeleteBanner } from '@/services/BannerService';
import { toast } from '@/components/ui/toast';
import appConfig from '@/configs/app.config';
import { useAuth } from '@/auth';
import useAuthority from '@/utils/hooks/useAuthority';
import { ADMIN } from '@/constants/roles.constant';

const BannerColumn = ({ row }) => {
    const { judul, gambar } = row;

    const featuredImageUrl = gambar ? `${appConfig.backendBaseUrl}${gambar}` : null;

    return (
        <div className="flex items-center gap-2">
            {featuredImageUrl ? (
                <Avatar
                    shape="round"
                    size={60}
                    src={featuredImageUrl}
                    alt={judul}
                />
            ) : (
                <Avatar
                    shape="round"
                    size={60}
                    icon={<HiOutlineDocumentText />}
                />
            )}
            <div>
                <div className="font-bold heading-text mb-1">{judul}</div>
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

const BannerListTable = () => {
    const navigate = useNavigate();

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [toDeleteId, setToDeleteId] = useState('');

    const handleCancel = () => {
        setDeleteConfirmationOpen(false);
    };

    const handleDelete = (banner) => {
        setDeleteConfirmationOpen(true);
        setToDeleteId(banner.id);
    };

    const handleEdit = (banner) => {
        navigate(`/admin/banners/edit/${banner.id}`); // Menggunakan ID untuk edit
    };

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false);
        try {
            await apiDeleteBanner(toDeleteId);
            mutate();
            setSelectAllBanners([]);
            setToDeleteId('');
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<HiOutlineDocumentText />}
                        className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 mr-2"
                    />
                    <span>Banner deleted successfully.</span>
                </div>
            );
        } catch (error) {
            console.error("Failed to delete banner:", error);
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<HiOutlineDocumentText />}
                        className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100 mr-2"
                    />
                    <span>Failed to delete banner. Please try again.</span>
                </div>
            );
            setDeleteConfirmationOpen(false);
        }
    };

    const {
        bannerList,
        bannerListTotal,
        bannerTableData,
        isLoading,
        setBannerTableData,
        setSelectAllBanners,
        selectedBanners,
        setSelectedBanners,
        mutate,
    } = useBannerList();

    const columns = useMemo(
        () => [
            {
                header: 'Title',
                accessorKey: 'judul',
                cell: (props) => {
                    const row = props.row.original;
                    return <BannerColumn row={row} />;
                },
            },
            {
                header: 'Description',
                accessorKey: 'keterangan',
            },
            {
                header: 'Link',
                accessorKey: 'link',
                cell: (props) => {
                    const { link } = props.row.original;
                    return <a href={link} target="_blank" rel="noopener noreferrer">{link}</a>;
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
                        onEdit={() => handleEdit(props.row.original)}
                        onDelete={() => handleDelete(props.row.original)}
                    />
                ),
            },
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [selectedBanners],
    );

    const handleSetTableData = (data) => {
        setBannerTableData(data);
        if (selectedBanners.length > 0) {
            setSelectAllBanners([]);
        }
    };

    const handlePaginationChange = (page) => {
        const newTableData = cloneDeep(bannerTableData);
        newTableData.pageIndex = page;
        handleSetTableData(newTableData);
    };

    const handleSelectChange = (value) => {
        const newTableData = cloneDeep(bannerTableData);
        newTableData.pageSize = Number(value);
        newTableData.pageIndex = 1;
        handleSetTableData(newTableData);
    };

    const handleSort = (sort) => {
        const newTableData = cloneDeep(bannerTableData);
        newTableData.sort = sort;
        handleSetTableData(newTableData);
    };

    const handleRowSelect = (checked, row) => {
        setSelectedBanners(checked, row);
    };

    const handleAllRowSelect = (checked, rows) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original);
            setSelectAllBanners(originalRows);
        } else {
            setSelectAllBanners([]);
        }
    };

    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={bannerList}
                noData={!isLoading && bannerList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 30, height: 30 }}
                loading={isLoading}
                pagingData={{
                    total: bannerListTotal,
                    pageIndex: bannerTableData.pageIndex,
                    pageSize: bannerTableData.pageSize,
                }}
                checkboxChecked={(row) =>
                    selectedBanners.some((selected) => selected.id === row.id)
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
                title="Remove Banner"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this banner? This action
                    can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default BannerListTable;