// src/views/admin/content/Tags/TagCreate/TagCreate.jsx (adjust path as needed)
import { useState } from 'react';
import Container from '@/components/shared/Container';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import TagForm from '../TagForm';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { TbTrash } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom'; 
import { apiCreateTag } from '@/services/TagService';

const TagCreate = () => {
    const navigate = useNavigate();

    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            const responseData = await apiCreateTag(values); 

            if (responseData) {
                toast.push(
                    <Notification type="success" title="Success">
                        Tag {responseData.name || 'Untitled Tag'} created successfully! {/* Use tag name */}
                    </Notification>,
                    { placement: 'top-center' },
                );
                navigate('/admin/tags');
            } else {
                toast.push(
                    <Notification type="warning" title="Unexpected Response">
                        Tag created but response was unexpected. Please check manually.
                    </Notification>,
                    { placement: 'top-center' },
                );
            }
        } catch (error) {
            console.error('Error creating tag in frontend:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to create tag: {error.response?.data?.message || 'Unknown error occurred.'}
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
                Tag creation discarded.
            </Notification>,
            { placement: 'top-center' },
        );
        navigate('/admin/tags');
    };


    const handleDiscard = () => {
        setDiscardConfirmationOpen(true);
    };

    const handleCancel = () => {
        setDiscardConfirmationOpen(false);
    };

    return (
        <>
            <TagForm
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
                                Create Tag
                            </Button>
                        </div>
                    </div>
                </Container>
            </TagForm>
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
                    Are you sure you want to discard this tag? This action cannot
                    be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default TagCreate;