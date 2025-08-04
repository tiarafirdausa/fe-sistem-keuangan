// src/views/admin/content/Pages/PageCreate/PageCreate.jsx
import { useState} from 'react';
import Container from '@/components/shared/Container';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import PageForm from '../PageForm';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { TbTrash } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { apiCreatePage } from '@/services/PageService';
import { PAGE_DEFAULT_VALUES } from '../PageForm/constants';
import { useAuth } from '@/auth'; // Impor useAuth

const PageCreate = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // Ambil user dari context autentikasi

    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            // Set author_id dengan ID pengguna yang sedang masuk
            formData.set('author_id', user.id);
            const responseData = await apiCreatePage(formData);

            if (responseData) {
                toast.push(
                    <Notification type="success" title="Success">
                        Page &quot;{responseData.title || 'Untitled Page'}&quot; created successfully!
                    </Notification>,
                    { placement: 'top-center' },
                );
                navigate('/admin/pages');
            } else {
                toast.push(
                    <Notification type="warning" title="Unexpected Response">
                        Page created but response was unexpected. Please check manually.
                    </Notification>,
                    { placement: 'top-center' },
                );
            }
        } catch (error) {
            console.error('Error creating page in frontend:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to create page: {error.response?.data?.error || 'Unknown error occurred.'}
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
                Page creation discarded.
            </Notification>,
            { placement: 'top-center' },
        );
        navigate('/admin/pages');
    };

    const handleDiscard = () => {
        setDiscardConfirmationOpen(true);
    };

    const handleCancel = () => {
        setDiscardConfirmationOpen(false);
    };

    return (
        <>
            <PageForm
                defaultValues={PAGE_DEFAULT_VALUES}
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
                                Create Page
                            </Button>
                        </div>
                    </div>
                </Container>
            </PageForm>
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
                    Are you sure you want to discard this page? This action cannot
                    be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default PageCreate;