// src/views/admin/content/Media/MediaCategoryCreate.js

import { useState } from 'react';
import Container from '@/components/shared/Container';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import MediaCategoryForm from '../MediaCategoryForm';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { TbTrash } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { apiCreateMediaCategory } from '@/services/MediaService';

const MediaCategoryCreate = () => {
    const navigate = useNavigate();

    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            const responseData = await apiCreateMediaCategory(values);

            if (responseData) {
                toast.push(
                    <Notification type="success" title="Success">
                        Media category {responseData.name || 'Untitled Category'} created successfully!
                    </Notification>,
                    { placement: 'top-center' },
                );
                navigate('/admin/media/categories');
            } else {
                toast.push(
                    <Notification type="warning" title="Unexpected Response">
                        Media category created but response was unexpected. Please check manually.
                    </Notification>,
                    { placement: 'top-center' },
                );
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Unknown error occurred.';
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to create media category: {errorMessage}
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
                Media category creation discarded.
            </Notification>,
            { placement: 'top-center' },
        );
        navigate('/admin/media/categories');
    };

    const handleDiscard = () => {
        setDiscardConfirmationOpen(true);
    };

    const handleCancel = () => {
        setDiscardConfirmationOpen(false);
    };

    return (
        <>
            <MediaCategoryForm
                defaultValues={{
                    name: '',
                    slug: '',
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
                                Create Category
                            </Button>
                        </div>
                    </div>
                </Container>
            </MediaCategoryForm>
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
                    Are you sure you want to discard this media category? This action cannot be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default MediaCategoryCreate;