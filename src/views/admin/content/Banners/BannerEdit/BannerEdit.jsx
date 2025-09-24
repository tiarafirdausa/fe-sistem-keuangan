import { useState, useMemo } from 'react';
import Container from '@/components/shared/Container';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import Spinner from '@/components/ui/Spinner';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import BannerForm from '../BannerForm';
import {
    apiGetBannerById,
    apiUpdateBanner,
    apiDeleteBanner,
} from '@/services/BannerService';
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb';
import { useParams, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import appConfig from '@/configs/app.config';
import { useAuth } from '@/auth';
import useAuthority from '@/utils/hooks/useAuthority';
import { ADMIN } from '@/constants/roles.constant';

const BannerEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const canDelete = useAuthority(user?.role ? [user.role] : [], [ADMIN]);

    const { data: bannerData, isLoading: isLoadingBanner, error: bannerError, mutate } = useSWR(
        id ? ['/banners/id', id] : null,
        // eslint-disable-next-line no-unused-vars
        async ([_, bannerId]) => {
            try {
                const response = await apiGetBannerById(bannerId);
                return response;
            } catch (err) {
                console.error("Error fetching banner by ID:", err);
                throw err;
            }
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    );

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const defaultFormValues = useMemo(() => {
        if (bannerData) {
            return {
                judul: bannerData.judul || '', 
                keterangan: bannerData.keterangan || '', 
                link: bannerData.link || '',
                gambar: bannerData.gambar
                    ? {
                        id: 'existing-featured',
                        img: `${appConfig.backendBaseUrl}${bannerData.gambar}`,
                        name: 'gambar'
                    }
                    : null,
                clear_gambar: false,
            };
        }
        return {};
    }, [bannerData]); 

    const handleFormSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            if (!bannerData?.id) {
                throw new Error("Banner ID not available for update.");
            }
            await apiUpdateBanner(bannerData.id, formData);

            toast.push(
                <Notification type="success" title="Success">
                    Banner updated successfully!
                </Notification>,
                { placement: 'top-center' },
            );
            mutate();
            navigate('/admin/banners');
        } catch (error) {
            console.error('Error updating banner:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to update banner: {error.response?.data?.error || 'Unknown error occurred.'}
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
        navigate('/admin/banners');
    };

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false);
        try {
            if (!bannerData?.id) {
                throw new Error("Banner ID not available for deletion.");
            }
            await apiDeleteBanner(bannerData.id);

            toast.push(
                <Notification type="success" title="Success">
                    Banner deleted successfully!
                </Notification>,
                { placement: 'top-center' },
            );
            navigate('/admin/banners');
        } catch (error) {
            console.error('Error deleting banner:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to delete banner: {error.response?.data?.error || 'Unknown error occurred.'}
                </Notification>,
                { placement: 'top-center' },
            );
        }
    };

    const isLoadingCombined = isLoadingBanner;

    if (isLoadingCombined) {
        return (
            <Container className="h-full flex items-center justify-center">
                <Spinner size={40} />
            </Container>
        );
    }

    if (bannerError || !bannerData) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <h3 className="mt-8">No banner found!</h3>
                <Button className="mt-4" onClick={handleBack}>
                    Go back to Banners
                </Button>
            </div>
        );
    }

    return (
        <>
            <BannerForm
                defaultValues={defaultFormValues}
                users={[]}
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
                            Back
                        </Button>
                        <div className="flex items-center">
                            {canDelete && (
                            <Button
                                className="ltr:mr-3 rtl:ml-3"
                                type="button"
                                customColorClass={() =>
                                    'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                }
                                icon={<TbTrash />}
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                            )}
                            <Button
                                variant="solid"
                                type="submit"
                                loading={isSubmitting}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </Container>
            </BannerForm>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove banner"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this banner? This action can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default BannerEdit;