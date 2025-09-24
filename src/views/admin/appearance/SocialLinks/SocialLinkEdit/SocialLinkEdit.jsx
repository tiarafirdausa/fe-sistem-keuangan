import { useState } from 'react';
import Container from '@/components/shared/Container';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import SocialLinkForm from '../SocialLinkForm';
import { apiGetSocialLinkById, apiUpdateSocialLink, apiDeleteSocialLink } from '@/services/SocialLinkService'; 
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb';
import { useParams, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { useAuth } from '@/auth';
import useAuthority from '@/utils/hooks/useAuthority';
import { ADMIN } from '@/constants/roles.constant';

const SocialLinkEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const canDelete = useAuthority(user?.role ? [user.role] : [], [ADMIN]);

    const { data: socialLinkData, isLoading, error, mutate } = useSWR(
        id ? ['/social-links/id', id] : null,
        // eslint-disable-next-line no-unused-vars
        ([_, socialLinkId]) => apiGetSocialLinkById(socialLinkId),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    );

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getDefaultValues = () => {
        if (socialLinkData) {
            const { platform, url, icon_class, is_active } = socialLinkData;
            return { platform, url, icon_class, is_active };
        }
        return {};
    };

    const handleFormSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            if (!socialLinkData?.id) {
                throw new Error("Social Link ID not available for update.");
            }
            await apiUpdateSocialLink(socialLinkData.id, values);

            toast.push(
                <Notification type="success" title="Success">
                    Social link updated successfully!
                </Notification>,
                { placement: 'top-center' },
            );
            mutate(); 
            navigate('/admin/social-links'); 
        } catch (error) {
            console.error('Error updating social link:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to update social link: {error.response?.data?.message || 'Unknown error occurred.'}
                </Notification>,
                { placement: 'top-center' },
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Open delete confirmation dialog
    const handleDelete = () => {
        setDeleteConfirmationOpen(true);
    };

    // Close delete confirmation dialog
    const handleCancel = () => {
        setDeleteConfirmationOpen(false);
    };

    // Navigate back to social links list
    const handleBack = () => {
        navigate('/admin/social-links');
    };

    // Confirm and perform deletion
    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false);
        try {
            if (!socialLinkData?.id) {
                throw new Error("Social Link ID not available for deletion.");
            }
            await apiDeleteSocialLink(socialLinkData.id);

            toast.push(
                <Notification type="success" title="Success">
                    Social link deleted successfully!
                </Notification>,
                { placement: 'top-center' },
            );
            navigate('/admin/social-links'); 
        } catch (error) {
            console.error('Error deleting social link:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to delete social link: {error.response?.data?.message || 'Unknown error occurred.'}
                </Notification>,
                { placement: 'top-center' },
            );
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <Container className="h-full flex items-center justify-center">
                <div>Loading social link data...</div>
            </Container>
        );
    }

    // No data found state
    if (!socialLinkData && !isLoading && !error) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <h3 className="mt-8">No social link found!</h3>
                <Button className="mt-4" onClick={handleBack}>
                    Go back to Social Links
                </Button>
            </div>
        );
    }

    return (
        <>
            <SocialLinkForm
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
            </SocialLinkForm>
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
                    Are you sure you want to remove this social link? This action can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default SocialLinkEdit;