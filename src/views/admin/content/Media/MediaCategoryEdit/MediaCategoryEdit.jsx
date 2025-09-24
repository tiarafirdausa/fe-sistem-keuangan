// src/views/admin/content/Media/MediaCategoryEdit.js

import { useState } from 'react';
import Container from '@/components/shared/Container';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import MediaCategoryForm from '../MediaCategoryForm';
import { apiGetMediaCategoryBySlug, apiUpdateMediaCategory, apiDeleteMediaCategory } from '@/services/MediaService';
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb';
import { useParams, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { useAuth } from '@/auth';
import useAuthority from '@/utils/hooks/useAuthority';
import { ADMIN } from '@/constants/roles.constant';

const MediaCategoryEdit = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const canDelete = useAuthority(user?.role ? [user.role] : [], [ADMIN]);

    const { data: mediaCategoryData, isLoading, error, mutate } = useSWR(
        slug ? ['/media-categories/slug', slug] : null,
        // eslint-disable-next-line no-unused-vars
        ([_, mediaCategorySlug]) => apiGetMediaCategoryBySlug(mediaCategorySlug),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    );

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getDefaultValues = () => {
        if (mediaCategoryData) {
            const { name, slug } = mediaCategoryData;
            return { name, slug };
        }
        return {};
    };

    const handleFormSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            if (!mediaCategoryData?.id) {
                throw new Error("Media Category ID not available for update.");
            }
            await apiUpdateMediaCategory(mediaCategoryData.id, values);

            toast.push(
                <Notification type="success" title="Success">
                    Media category updated successfully!
                </Notification>,
                { placement: 'top-center' },
            );
            mutate();
            navigate('/admin/media/categories');
        } catch (error) {
            console.error('Error updating media category:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to update media category: {error.response?.data?.message || 'Unknown error occurred.'}
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
        navigate('/admin/media/categories');
    };

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false);
        try {
            if (!mediaCategoryData?.id) {
                throw new Error("Media Category ID not available for deletion.");
            }
            await apiDeleteMediaCategory(mediaCategoryData.id);

            toast.push(
                <Notification type="success" title="Success">
                    Media category deleted successfully!
                </Notification>,
                { placement: 'top-center' },
            );
            navigate('/admin/media/categories');
        } catch (error) {
            console.error('Error deleting media category:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to delete media category: {error.response?.data?.message || 'Unknown error occurred.'}
                </Notification>,
                { placement: 'top-center' },
            );
        }
    };

    if (isLoading) {
        return (
            <Container className="h-full flex items-center justify-center">
                <div>Loading media category data...</div>
            </Container>
        );
    }

    if (!mediaCategoryData && !isLoading && !error) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <h3 className="mt-8">No media category found!</h3>
                <Button className="mt-4" onClick={handleBack}>
                    Go back to Media Categories
                </Button>
            </div>
        );
    }

    return (
        <>
            <MediaCategoryForm
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
            </MediaCategoryForm>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove media category"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this media category? This action can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default MediaCategoryEdit;