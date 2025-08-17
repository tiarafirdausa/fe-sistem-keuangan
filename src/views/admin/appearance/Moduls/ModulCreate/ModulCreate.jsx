import { useState } from 'react';
import Container from '@/components/shared/Container';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import ModulForm from '../ModulForm';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { TbTrash } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { apiCreateModul } from '@/services/modulService';

const ModulCreate = () => {
    const navigate = useNavigate();

    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handler untuk mengirim form pembuatan modul
    const handleFormSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            const response = await apiCreateModul(values);

            if (response.data) {
                toast.push(
                    <Notification type="success" title="Sukses">
                        Modul {response.data.judul || 'Tanpa Judul'} berhasil dibuat!
                    </Notification>,
                    { placement: 'top-center' },
                );
                navigate('/admin/moduls');
            } else {
                toast.push(
                    <Notification type="warning" title="Respon Tidak Terduga">
                        Modul berhasil dibuat, namun responnya tidak terduga. Mohon periksa secara manual.
                    </Notification>,
                    { placement: 'top-center' },
                );
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.error ||
                error.response?.data?.message ||
                'Terjadi kesalahan tidak dikenal.';
            toast.push(
                <Notification type="danger" title="Error">
                    Gagal membuat modul: {errorMessage}
                </Notification>,
                { placement: 'top-center' },
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(false);
        toast.push(
            <Notification type="info" title="Dibatalkan">
                Pembuatan modul dibatalkan.
            </Notification>,
            { placement: 'top-center' },
        );
        navigate('/admin/moduls');
    };

    const handleDiscard = () => {
        setDiscardConfirmationOpen(true);
    };

    const handleCancel = () => {
        setDiscardConfirmationOpen(false);
    };

    return (
        <>
            <ModulForm
                defaultValues={{
                    judul: '',
                    folder: '',
                    menu: false,
                    konten: false,
                    widget: false,
                    home: false,
                    aktif: true,
                }}
                onFormSubmit={handleFormSubmit}
            >
                <Container>
                    <div className="flex items-center justify-between px-8">
                        <span></span>
                        <div className="flex items-center">
                            <Button
                                className="ltr:mr-3 rtl:ml-3"
                                type="button"
                                customColorClass={() =>
                                    'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                }
                                icon={<TbTrash />}
                                onClick={handleDiscard}
                            >
                                Batal
                            </Button>
                            <Button
                                variant="solid"
                                type="submit"
                                loading={isSubmitting}
                            >
                                Buat Modul
                            </Button>
                        </div>
                    </div>
                </Container>
            </ModulForm>
            <ConfirmDialog
                isOpen={discardConfirmationOpen}
                type="danger"
                title="Batalkan perubahan"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDiscard}
            >
                <p>
                    Apakah Anda yakin ingin membatalkan modul ini? Tindakan ini tidak bisa dibatalkan.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default ModulCreate;
