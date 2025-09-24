// src/views/admin/content/Categories/CategoryEdit/CategoryEdit.jsx
import { useState } from 'react';
import Container from '@/components/shared/Container';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import CategoryForm from '../CategoryForm/CategoryForm';
import { apiGetCategoryBySlug, apiUpdateCategory, apiDeleteCategory } from '@/services/CategoryService';
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb';
import { useParams, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { useAuth } from '@/auth';
import useAuthority from '@/utils/hooks/useAuthority';
import { ADMIN } from '@/constants/roles.constant';

const CategoryEdit = () => { 
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const canDelete = useAuthority(user?.role ? [user.role] : [], [ADMIN]);

    const { data: categoryData, isLoading, error, mutate } = useSWR( 
        slug ? ['/categories/slug', slug] : null,
        // eslint-disable-next-line no-unused-vars
        ([_, categorySlug]) => apiGetCategoryBySlug(categorySlug), 
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    );

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getDefaultValues = () => {
        if (categoryData) { 
            const { name, slug } = categoryData;
            return { name, slug };
        }
        return {};
    };

    const handleFormSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            if (!categoryData?.id) { 
                throw new Error("Category ID not available for update.");
            }
            await apiUpdateCategory(categoryData.id, values);

            toast.push(
                <Notification type="success" title="Success">
                    Category updated successfully!
                </Notification>,
                { placement: 'top-center' },
            );
            mutate();
            navigate('/admin/categories'); 
        } catch (error) {
            console.error('Error updating category:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to update category: {error.response?.data?.message || 'Unknown error occurred.'}
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
        navigate('/admin/categories'); 
    };

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false);
        try {
            if (!categoryData?.id) { 
                throw new Error("Category ID not available for deletion.");
            }
            await apiDeleteCategory(categoryData.id); 

            toast.push(
                <Notification type="success" title="Success">
                    Category deleted successfully!
                </Notification>,
                { placement: 'top-center' },
            );
            navigate('/admin/categories'); 
        } catch (error) {
            console.error('Error deleting category:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to delete category: {error.response?.data?.message || 'Unknown error occurred.'}
                </Notification>,
                { placement: 'top-center' },
            );
        }
    };

    if (isLoading) {
        return (
            <Container className="h-full flex items-center justify-center">
                <div>Loading category data...</div> 
            </Container>
        );
    }

    if (!categoryData && !isLoading && !error) { 
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <h3 className="mt-8">No category found!</h3>
                <Button className="mt-4" onClick={handleBack}>
                    Go back to Categories 
                </Button>
            </div>
        );
    }

    return (
        <>
            <CategoryForm
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
            </CategoryForm>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove category" 
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this category? This action can&apos;t be undone. 
                </p>
            </ConfirmDialog>
        </>
    );
};

export default CategoryEdit; 