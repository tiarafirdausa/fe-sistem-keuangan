import { useMemo, useState } from 'react';
import Avatar from '@/components/ui/Avatar';
import Tooltip from '@/components/ui/Tooltip';
import DataTable from '@/components/shared/DataTable';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import useModulList from '../hooks/useModulList';
import cloneDeep from 'lodash/cloneDeep';
import { useNavigate } from 'react-router-dom';
import { TbPencil, TbTrash, TbTags, TbCheck, TbX } from 'react-icons/tb'; // <-- pastikan icon TbCheck dan TbX sudah diimpor
import { FaBook } from 'react-icons/fa';
import { Tag } from '@/components/ui';
import { toast } from '@/components/ui/toast';
import { apiDeleteModul } from '@/services/modulService';

const ModulColumn = ({ row }) => {
    return (
        <div className="flex items-center gap-2">
            <Avatar shape="round" size={30} icon={<FaBook />} />

            <div>
                <div className="font-bold heading-text mb-1">{row.judul}</div>

                <Tag className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100">
                    Folder: {row.folder}
                </Tag>
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

// Komponen khusus untuk menampilkan ikon
const StatusIcon = ({ value }) => {
    return (
        <span className="text-xl">
            {value === 1 ? <TbCheck className="text-emerald-500" /> : <TbX className="text-red-500" />}
        </span>
    );
};

const ModulListTable = () => {
    const navigate = useNavigate();

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [toDeleteId, setToDeleteId] = useState('');

    const handleCancel = () => {
        setDeleteConfirmationOpen(false);
    };

    const handleDelete = (modul) => {
        setDeleteConfirmationOpen(true);
        setToDeleteId(modul.id_modul);
    };

    const handleEdit = (modul) => {
        navigate(`/admin/moduls/edit/${modul.id_modul}`);
    };

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false);
        try {
            await apiDeleteModul(toDeleteId);

            mutate();

            setSelectAllModuls([]);
            setToDeleteId('');

            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<TbTags />}
                        className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 mr-2"
                    />
                    <span>Modul deleted successfully.</span>
                </div>,
            );
        } catch (error) {
            console.error('Failed to delete modul:', error);
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<TbTags />}
                        className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100 mr-2"
                    />

                    <span>Failed to delete modul. Please try again.</span>
                </div>,
            );
            setDeleteConfirmationOpen(false);
        }
    };

    const {
        modulList,
        modulListTotal,
        modulTableData,
        isLoading,
        setModulTableData,
        setSelectAllModuls,
        setSelectedModuls,
        selectedModuls,
        mutate,
    } = useModulList();

    const columns = useMemo(
        () => [
            {
                header: 'Judul',
                accessorKey: 'judul',
                cell: (props) => {
                    const row = props.row.original;
                    return <ModulColumn row={row} />;
                },
            },
            {
                header: 'Menu',
                accessorKey: 'menu',
                cell: (props) => <StatusIcon value={props.row.original.menu} />,
            },
            {
                header: 'Konten',
                accessorKey: 'konten',
                cell: (props) => <StatusIcon value={props.row.original.konten} />,
            },
            {
                header: 'Widget',
                accessorKey: 'widget',
                cell: (props) => <StatusIcon value={props.row.original.widget} />,
            },
            {
                header: 'Home',
                accessorKey: 'home',
                cell: (props) => <StatusIcon value={props.row.original.home} />,
            },
            {
                header: 'Aktif',
                accessorKey: 'aktif',
                cell: (props) => <StatusIcon value={props.row.original.aktif} />,
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
        [selectedModuls],
    );

    const handleSetTableData = (data) => {
        setModulTableData(data);
        if (selectedModuls.length > 0) {
            setSelectAllModuls([]);
        }
    };

    const handlePaginationChange = (page) => {
        const newTableData = cloneDeep(modulTableData);
        newTableData.pageIndex = page;
        handleSetTableData(newTableData);
    };

    const handleSelectChange = (value) => {
        const newTableData = cloneDeep(modulTableData);
        newTableData.pageSize = Number(value);
        newTableData.pageIndex = 1;
        handleSetTableData(newTableData);
    };

    const handleSort = (sort) => {
        const newTableData = cloneDeep(modulTableData);
        newTableData.sort = sort;
        handleSetTableData(newTableData);
    };

    const handleRowSelect = (checked, row) => {
        setSelectedModuls(checked, row);
    };

    const handleAllRowSelect = (checked, rows) => {
        if (checked) {
            const originalRows = rows.map((row) => row.original);
            setSelectAllModuls(originalRows);
        } else {
            setSelectAllModuls([]);
        }
    };

    return (
        <>
            <DataTable
                selectable
                columns={columns}
                data={modulList}
                noData={!isLoading && modulList.length === 0}
                skeletonAvatarColumns={[0]}
                skeletonAvatarProps={{ width: 30, height: 30 }}
                loading={isLoading}
                pagingData={{
                    total: modulListTotal,
                    pageIndex: modulTableData.pageIndex,
                    pageSize: modulTableData.pageSize,
                }}
                checkboxChecked={(row) =>
                    selectedModuls.some(
                        (selected) => selected.id_modul === row.id_modul,
                    )
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
                title="Remove Modul"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this modul? This action
                    can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default ModulListTable;