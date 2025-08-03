// src/views/admin/content/Media/MediaCreate/MediaCreate.jsx
import { useState } from 'react';
import Container from '@/components/shared/Container';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { TbTrash } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { apiCreateMediaCollection } from '@/services/MediaService';
import MediaForm from '../MediaForm';
import { MEDIA_DEFAULT_VALUES } from '../MediaForm/constants';
import { useAuth } from '@/auth';

const MediaCreate = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); 

    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            if (user?.id) {
                formData.append('uploaded_by', user.id); 
            }
            
            const responseData = await apiCreateMediaCollection(formData);

            if (responseData) {
                toast.push(
                    <Notification type="success" title="Success">
                        Media &quot;{responseData.title || 'Untitled'}&quot; created successfully!
                    </Notification>,
                    { placement: 'top-center' },
                );
                navigate('/admin/media/list');
            } else {
                toast.push(
                    <Notification type="warning" title="Unexpected Response">
                        Media created but response was unexpected. Please check manually.
                    </Notification>,
                    { placement: 'top-center' },
                );
            }
        } catch (error) {
            console.error('Error creating media:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to create media: {error.response?.data?.error || 'Unknown error occurred.'}
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
                Media creation discarded.
            </Notification>,
            { placement: 'top-center' },
        );
        navigate('/admin/media/list');
    };

    const handleDiscard = () => {
        setDiscardConfirmationOpen(true);
    };

    const handleCancel = () => {
        setDiscardConfirmationOpen(false);
    };

    return (
        <>
            <MediaForm
                defaultValues={MEDIA_DEFAULT_VALUES}
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
                                Create Media
                            </Button>
                        </div>
                    </div>
                </Container>
            </MediaForm>
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
                    Are you sure you want to discard this media? This action cannot
                    be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default MediaCreate;