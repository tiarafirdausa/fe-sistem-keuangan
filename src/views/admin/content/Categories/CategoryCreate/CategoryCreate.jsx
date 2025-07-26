// src/views/admin/content/Categories/CategoryCreate/CategoryCreate.jsx
import { useState } from 'react';
import Container from '@/components/shared/Container';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import CategoryForm from '../CategoryForm/CaregoryForm';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { TbTrash } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { apiCreateCategory } from '@/services/CategoryService';

const CategoryCreate = () => { 
    const navigate = useNavigate();

    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            const responseData = await apiCreateCategory(values); 

            if (responseData) {
                toast.push(
                    <Notification type="success" title="Success">
                        Category {responseData.name || 'Untitled Category'} created successfully!
                    </Notification>,
                    { placement: 'top-center' },
                );
                navigate('/admin/categories');
            } else {
                toast.push(
                    <Notification type="warning" title="Unexpected Response">
                        Category created but response was unexpected. Please check manually.
                    </Notification>,
                    { placement: 'top-center' },
                );
            }
        } catch (error) {
            console.error('Error creating category in frontend:', error.response?.data || error.message); 
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to create category: {error.response?.data?.message || 'Unknown error occurred.'} 
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
                Category creation discarded. 
            </Notification>,
            { placement: 'top-center' },
        );
        navigate('/admin/categories');
    };


    const handleDiscard = () => {
        setDiscardConfirmationOpen(true);
    };

    const handleCancel = () => {
        setDiscardConfirmationOpen(false);
    };

    return (
        <>
            <CategoryForm 
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
            </CategoryForm>
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
                    Are you sure you want to discard this category? This action cannot 
                    be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default CategoryCreate; 