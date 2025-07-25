import { useState } from 'react';
import Container from '@/components/shared/Container';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import SocialLinkForm from '../SocialLinkForm'; 
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { TbTrash } from 'react-icons/tb';
import { useNavigate } from 'react-router';
import { apiCreateSocialLink } from '@/services/SocialLinkService'; 

const SocialLinkCreate = () => {
    const navigate = useNavigate();

    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            const responseData = await apiCreateSocialLink(values);

            if (responseData) {
                toast.push(
                    <Notification type="success" title="Success">
                        Social link {responseData.platform || 'Untitled Social Link'} created successfully!
                    </Notification>,
                    { placement: 'top-center' },
                );
                navigate('/admin/social-links'); 
            } else {
                toast.push(
                    <Notification type="warning" title="Unexpected Response">
                        Social link created but response was unexpected. Please check manually.
                    </Notification>,
                    { placement: 'top-center' },
                );
            }
        } catch (error) {
            console.error('Error creating social link in frontend:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to create social link: {error.response?.data?.message || 'Unknown error occurred.'}
                </Notification>,
                { placement: 'top-center' },
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    // Confirm and perform discard
    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(false);
        toast.push(
            <Notification type="info" title="Discarded">
                Social link creation discarded.
            </Notification>,
            { placement: 'top-center' },
        );
        navigate('/admin/social-links'); 
    };

    // Open discard confirmation dialog
    const handleDiscard = () => {
        setDiscardConfirmationOpen(true);
    };

    // Close discard confirmation dialog
    const handleCancel = () => {
        setDiscardConfirmationOpen(false);
    };

    return (
        <>
            <SocialLinkForm
                defaultValues={{
                    platform: '',
                    url: '',
                    icon_class: '',
                    is_active: 1,
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
                                Discard
                            </Button>
                            <Button
                                variant="solid"
                                type="submit"
                                loading={isSubmitting}
                            >
                                Create Social Link
                            </Button>
                        </div>
                    </div>
                </Container>
            </SocialLinkForm>
            <ConfirmDialog
                isOpen={discardConfirmationOpen}
                type="danger"
                title="Discard changes"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDiscard}
            >
                <p>
                    Are you sure you want to discard this social link? This action cannot
                    be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default SocialLinkCreate;