// src/views/admin/content/Media/MediaEdit/MediaEdit.jsx
import { useState, useMemo } from 'react';
import Container from '@/components/shared/Container';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import Spinner from '@/components/ui/Spinner';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import MediaForm from '../MediaForm';
import {
    apiGetMediaCollectionById,
    apiUpdateMediaCollection,
    apiDeleteMediaCollection
} from '@/services/MediaService';
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb';
import { useParams, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import appConfig from '@/configs/app.config';
import { useAuth } from '@/auth';
import useAuthority from '@/utils/hooks/useAuthority';
import { ADMIN } from '@/constants/roles.constant';

const MediaEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth(); 
    const canDelete = useAuthority(user?.role ? [user.role] : [], [ADMIN]);

    const { data: mediaData, isLoading: isLoadingMedia, error: mediaError, mutate } = useSWR(
        id ? ['/media', id] : null,
        // eslint-disable-next-line no-unused-vars
        async ([_, mediaId]) => {
            try {
                const response = await apiGetMediaCollectionById(mediaId);
                return response;
            } catch (err) {
                console.error("Error fetching media by ID:", err);
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
        if (mediaData) {
            const featuredImage = mediaData.featured_image 
                ? {
                      id: mediaData.id,
                      url: `${appConfig.backendBaseUrl}${mediaData.original_featured_image || mediaData.featured_image}`,
                      originalUrl: mediaData.original_featured_image ? `${appConfig.backendBaseUrl}${mediaData.original_featured_image}` : null,
                      name: mediaData.featured_image.split('/').pop(), 
                  }
                : null;

            const values = {
                title: mediaData.title || '',
                caption: mediaData.caption || '', 
                media: mediaData.files?.map(file => {
                    const url = `${appConfig.backendBaseUrl}${file.url}`;
                    const fileExtension = file.url.split('.').pop().toLowerCase();
                    const isVideo = ['mp4', 'mov', 'webm'].includes(fileExtension);
                    
                    return{
                        id: file.id,
                        url: url,
                        isVideo: isVideo,
                        img: url, 
                        name: file.file_name,
                    }
                }) || [],
                category_id: mediaData.category_id || null,
                featured_image: featuredImage,
                meta_title: mediaData.meta_title || '',
                meta_description: mediaData.meta_description || '',
                uploaded_by: mediaData.uploaded_by || user?.id || null,
                clear_media_files: false,
                delete_media_file_ids: [],
            };
            return values;
        }
        return {};
    }, [mediaData, user]);

    const handleFormSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            if (!mediaData?.id) {
                throw new Error("Media ID not available for update.");
            }
            if (!formData.has('uploaded_by') && user?.id) {
                formData.append('uploaded_by', user.id);
            }

            await apiUpdateMediaCollection(mediaData.id, formData);

            toast.push(
                <Notification type="success" title="Success">
                    Media updated successfully!
                </Notification>,
                { placement: 'top-center' },
            );
            mutate();
            navigate('/admin/media/list');
        } catch (error) {
            console.error('Error updating media:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to update media: {error.response?.data?.error || 'Unknown error occurred.'}
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
        navigate('/admin/media/list');
    };

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false);
        try {
            if (!mediaData?.id) {
                throw new Error("Media ID not available for deletion.");
            }
            await apiDeleteMediaCollection(mediaData.id);

            toast.push(
                <Notification type="success" title="Success">
                    Media deleted successfully!
                </Notification>,
                { placement: 'top-center' },
            );
            navigate('/admin/media/list');
        } catch (error) {
            console.error('Error deleting media:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to delete media: {error.response?.data?.error || 'Unknown error occurred.'}
                </Notification>,
                { placement: 'top-center' },
            );
        }
    };

    const isLoadingCombined = isLoadingMedia;

    if (isLoadingCombined) {
        return (
            <Container className="h-full flex items-center justify-center">
                <Spinner size={40} />
            </Container>
        );
    }

    if (mediaError || !mediaData) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <h3 className="mt-8">No media found!</h3>
                <Button className="mt-4" onClick={handleBack}>
                    Go back to Media
                </Button>
            </div>
        );
    }

    return (
        <>
            <MediaForm
                defaultValues={defaultFormValues}
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
            </MediaForm>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove media"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this media? This action can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default MediaEdit;