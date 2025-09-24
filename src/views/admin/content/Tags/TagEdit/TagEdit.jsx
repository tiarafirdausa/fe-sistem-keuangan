// src/views/admin/content/Tags/TagEdit/TagEdit.jsx
import { useState } from 'react';
import Container from '@/components/shared/Container';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import TagForm from '../TagForm';
import { apiGetTagBySlug, apiUpdateTag, apiDeleteTag } from '@/services/TagService'; 
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb';
import { useParams, useNavigate } from 'react-router-dom'; 
import useSWR from 'swr';
import { useAuth } from '@/auth';
import useAuthority from '@/utils/hooks/useAuthority';
import { ADMIN } from '@/constants/roles.constant';

const TagEdit = () => {
    const { slug } = useParams(); 
    const navigate = useNavigate();
    const { user } = useAuth();
    const canDelete = useAuthority(user?.role ? [user.role] : [], [ADMIN]);

    const { data: tagData, isLoading, error, mutate } = useSWR(
        slug ? ['/tags/slug', slug] : null, 
        // eslint-disable-next-line no-unused-vars
        ([_, tagSlug]) => apiGetTagBySlug(tagSlug),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    );

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false); 

    const getDefaultValues = () => {
        if (tagData) {
            const { name, slug } = tagData;
            return { name, slug };
        }
        return {}; 
    };

    const handleFormSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            if (!tagData?.id) {
                throw new Error("Tag ID not available for update.");
            }
            await apiUpdateTag(tagData.id, values); 

            toast.push(
                <Notification type="success" title="Success">
                    Tag updated successfully!
                </Notification>,
                { placement: 'top-center' },
            );
            mutate();
            navigate('/admin/tags'); 
        } catch (error) {
            console.error('Error updating tag:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to update tag: {error.response?.data?.message || 'Unknown error occurred.'}
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
        navigate('/admin/tags');
    };

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false); 
        try {
            if (!tagData?.id) {
                throw new Error("Tag ID not available for deletion.");
            }
            await apiDeleteTag(tagData.id); 

            toast.push(
                <Notification type="success" title="Success">
                    Tag deleted successfully!
                </Notification>,
                { placement: 'top-center' },
            );
            navigate('/admin/tags'); 
        } catch (error) {
            console.error('Error deleting tag:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to delete tag: {error.response?.data?.message || 'Unknown error occurred.'}
                </Notification>,
                { placement: 'top-center' },
            );
        }
    };

    if (isLoading) {
        return (
            <Container className="h-full flex items-center justify-center">
                <div>Loading tag data...</div>
            </Container>
        );
    }

    if (!tagData && !isLoading && !error) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <h3 className="mt-8">No tag found!</h3>
                <Button className="mt-4" onClick={handleBack}>
                    Go back to Tags
                </Button>
            </div>
        );
    }

    return (
        <>
            <TagForm
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
            </TagForm>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove tag"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this tag? This action can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default TagEdit;