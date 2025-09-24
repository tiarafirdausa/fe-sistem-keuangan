// src/views/admin/content/Pages/PageEdit/PageEdit.jsx
import { useState, useMemo } from 'react';
import Container from '@/components/shared/Container';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import Spinner from '@/components/ui/Spinner';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import PageForm from '../PageForm';
import {
    apiGetPageBySlug,
    apiUpdatePage,
    apiDeletePage,
} from '@/services/PageService';
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb';
import { useParams, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import appConfig from '@/configs/app.config';
import { useAuth } from '@/auth';
import useAuthority from '@/utils/hooks/useAuthority';
import { ADMIN } from '@/constants/roles.constant';

const PageEdit = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const canDelete = useAuthority(user?.role ? [user.role] : [], [ADMIN]);

    const { data: pageData, isLoading: isLoadingPage, error: pageError, mutate } = useSWR(
        slug ? ['/pages/slug', slug] : null,
        // eslint-disable-next-line no-unused-vars
        async ([_, pageSlug]) => {
            try {
                const response = await apiGetPageBySlug(pageSlug);
                return response;
            } catch (err) {
                console.error("Error fetching page by slug:", err);
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
        if (pageData) {
            return {
                title: pageData.title || '',
                slug: pageData.slug || '',
                content: pageData.content || '',
                featured_image: pageData.featured_image
                    ? {
                        id: 'existing-featured',
                        img: `${appConfig.backendBaseUrl}${pageData.featured_image}`,
                        name: 'featured_image'
                    }
                    : null,
                gallery_images: pageData.gallery_images?.map(img => ({
                    id: img.id,
                    img: `${appConfig.backendBaseUrl}${img.image_path}`,
                    name: img.alt_text || `gallery_image_${img.id}`
                })) || [],
                meta_title: pageData.meta_title || '',
                meta_description: pageData.meta_description || '',
                author_id: pageData.author_id || (user ? user.id : 1),
                clear_featured_image: false,
                delete_gallery_image_ids: [],
                clear_gallery_images: false,
            };
        }
        return {};
    }, [pageData, user]);

    const handleFormSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            if (!pageData?.id) {
                throw new Error("Page ID not available for update.");
            }
            await apiUpdatePage(pageData.id, formData);

            toast.push(
                <Notification type="success" title="Success">
                    Page updated successfully!
                </Notification>,
                { placement: 'top-center' },
            );
            mutate();
            navigate('/admin/pages');
        } catch (error) {
            console.error('Error updating page:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to update page: {error.response?.data?.error || 'Unknown error occurred.'}
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
        navigate('/admin/pages');
    };

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false);
        try {
            if (!pageData?.id) {
                throw new Error("Page ID not available for deletion.");
            }
            await apiDeletePage(pageData.id);

            toast.push(
                <Notification type="success" title="Success">
                    Page deleted successfully!
                </Notification>,
                { placement: 'top-center' },
            );
            navigate('/admin/pages');
        } catch (error) {
            console.error('Error deleting page:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to delete page: {error.response?.data?.error || 'Unknown error occurred.'}
                </Notification>,
                { placement: 'top-center' },
            );
        }
    };

    const isLoadingCombined = isLoadingPage;

    if (isLoadingCombined) {
        return (
            <Container className="h-full flex items-center justify-center">
                <Spinner size={40} />
            </Container>
        );
    }

    if (pageError || !pageData) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <h3 className="mt-8">No page found!</h3>
                <Button className="mt-4" onClick={handleBack}>
                    Go back to Pages
                </Button>
            </div>
        );
    }

    return (
        <>
            <PageForm
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
            </PageForm>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove page"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this page? This action can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default PageEdit;