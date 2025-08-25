import { useState } from 'react';
import Container from '@/components/shared/Container';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import BannerForm from '../BannerForm';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { TbTrash } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { apiCreateBanner } from '@/services/BannerService'; // Adjust service to BannerService
import { BANNER_DEFAULT_VALUES } from '../BannerForm/constants'; // Adjust constant to BANNER_DEFAULT_VALUES
import { useAuth } from '@/auth';

const BannerCreate = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            formData.set('author_id', user.id);
            const responseData = await apiCreateBanner(formData);

            if (responseData) {
                toast.push(
                    <Notification type="success" title="Success">
                        Banner &quot;{responseData.title || 'Untitled Banner'}&quot; created successfully!
                    </Notification>,
                    { placement: 'top-center' },
                );
                navigate('/admin/banners');
            } else {
                toast.push(
                    <Notification type="warning" title="Unexpected Response">
                        Banner created but response was unexpected. Please check manually.
                    </Notification>,
                    { placement: 'top-center' },
                );
            }
        } catch (error) {
            console.error('Error creating banner in frontend:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to create banner: {error.response?.data?.error || 'Unknown error occurred.'}
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
            <Notification type="info" title="Discarded">
                Banner creation discarded.
            </Notification>,
            { placement: 'top-center' },
        );
        navigate('/admin/banners');
    };

    const handleDiscard = () => {
        setDiscardConfirmationOpen(true);
    };

    const handleCancel = () => {
        setDiscardConfirmationOpen(false);
    };

    return (
        <>
            <BannerForm
                defaultValues={BANNER_DEFAULT_VALUES}
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
                                Create Banner
                            </Button>
                        </div>
                    </div>
                </Container>
            </BannerForm>
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
                    Are you sure you want to discard this banner? This action cannot
                    be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default BannerCreate;