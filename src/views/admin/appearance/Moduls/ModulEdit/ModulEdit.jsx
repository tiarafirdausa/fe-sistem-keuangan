import { useState } from 'react';
import Container from '@/components/shared/Container';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import ModulForm from '../ModulForm';
import {
    apiGetModulById,
    apiUpdateModul,
    apiDeleteModul,
} from '@/services/modulService';
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb';
import { useParams, useNavigate } from 'react-router-dom';
import useSWR from 'swr';

const ModulEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Mengambil data modul dari API menggunakan useSWR
    const { data: modulData, isLoading, error, mutate } = useSWR(
        id ? ['/moduls', id] : null,
        // eslint-disable-next-line no-unused-vars
        ([_, modulId]) => apiGetModulById(modulId),
        {
            revalidateOnFocus: false,
            revalidateIfStale: true,
        },
    );

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getDefaultValues = () => {
        if (modulData) {
            const { judul, folder, widget, home, aktif } = modulData;
            return {
                judul,
                folder,
                widget: Boolean(widget),
                home: Boolean(home),
                aktif: Boolean(aktif),
            };
        }
        return {};
    };

    const handleFormSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            if (!modulData?.id_modul) {
                throw new Error('Modul ID tidak tersedia untuk pembaruan.');
            }
            await apiUpdateModul(modulData.id_modul, values);

            toast.push(
                <Notification type="success" title="Sukses">
                    Modul berhasil diperbarui!
                </Notification>,
                { placement: 'top-center' },
            );
            mutate();
            navigate('/admin/moduls');
        } catch (error) {
            console.error(
                'Gagal memperbarui modul:',
                error.response?.data || error.message,
            );
            toast.push(
                <Notification type="danger" title="Error">
                    Gagal memperbarui modul:
                    {error.response?.data?.message || 'Terjadi kesalahan tidak dikenal.'}
                </Notification>,
                { placement: 'top-center' },
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = () => {
        setDeleteConfirmationOpen(true);
    };

    const handleCancel = () => {
        setDeleteConfirmationOpen(false);
    };

    const handleBack = () => {
        navigate('/admin/moduls');
    };

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false);
        try {
            if (!modulData?.id_modul) {
                throw new Error('Modul ID tidak tersedia untuk penghapusan.');
            }
            await apiDeleteModul(modulData.id_modul);

            toast.push(
                <Notification type="success" title="Sukses">
                    Modul berhasil dihapus!
                </Notification>,
                { placement: 'top-center' },
            );
            navigate('/admin/moduls');
        } catch (error) {
            console.error(
                'Gagal menghapus modul:',
                error.response?.data || error.message,
            );
            toast.push(
                <Notification type="danger" title="Error">
                    Gagal menghapus modul:
                    {error.response?.data?.message || 'Terjadi kesalahan tidak dikenal.'}
                </Notification>,
                { placement: 'top-center' },
            );
        }
    };

    if (isLoading) {
        return (
            <Container className="h-full flex items-center justify-center">
                <div>Memuat data modul...</div>
            </Container>
        );
    }

    if (!modulData && !isLoading && !error) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <h3 className="mt-8">Modul tidak ditemukan!</h3>
                <Button className="mt-4" onClick={handleBack}>
                    Kembali ke Daftar Modul
                </Button>
            </div>
        );
    }

    return (
        <>
            <ModulForm
                defaultValues={getDefaultValues()}
                onFormSubmit={handleFormSubmit}
            >
                <Container>
                    <div className="flex items-center justify-between px-8">
                        <Button
                            className="ltr:mr-3 rtl:ml-3"
                            type="button"
                            variant="plain"
                            icon={<TbArrowNarrowLeft />}
                            onClick={handleBack}
                        >
                            Kembali
                        </Button>
                        <div className="flex items-center">
                            <Button
                                className="ltr:mr-3 rtl:ml-3"
                                type="button"
                                customColorClass={() =>
                                    'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                }
                                icon={<TbTrash />}
                                onClick={handleDelete}
                            >
                                Hapus
                            </Button>
                            <Button
                                variant="solid"
                                type="submit"
                                loading={isSubmitting}
                            >
                                Simpan Perubahan
                            </Button>
                        </div>
                    </div>
                </Container>
            </ModulForm>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Hapus Modul"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Apakah Anda yakin ingin menghapus modul ini? Tindakan ini tidak bisa dibatalkan.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default ModulEdit;