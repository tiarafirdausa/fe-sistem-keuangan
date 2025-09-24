import { useState } from 'react';
import Container from '@/components/shared/Container';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import MenuForm from '../MenuForm';
import { apiGetMenuById, apiUpdateMenu, apiDeleteMenu } from '@/services/MenuService'; 
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb';
import { useParams, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { useAuth } from '@/auth';
import useAuthority from '@/utils/hooks/useAuthority';
import { ADMIN } from '@/constants/roles.constant';

const MenuEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const canDelete = useAuthority(user?.role ? [user.role] : [], [ADMIN]);

    const { data: menuData, isLoading, error, mutate } = useSWR(
        id ? ['/menus/id', id] : null,
        // eslint-disable-next-line no-unused-vars
        ([_, menuId]) => apiGetMenuById(menuId), 
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    );

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getDefaultValues = () => {
        if (menuData) {
            const { name, slug } = menuData;
            return { name, slug };
        }
        return {};
    };

    const handleFormSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            if (!menuData?.id) {
                throw new Error("Menu ID not available for update.");
            }
            await apiUpdateMenu(menuData.id, values); 

            toast.push(
                <Notification type="success" title="Success">
                    Menu updated successfully!
                </Notification>,
                { placement: 'top-center' },
            );
            mutate(); 
            navigate('/admin/menus'); 
        } catch (error) {
            console.error('Error updating menu:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to update menu: {error.response?.data?.message || 'Unknown error occurred.'}
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

    // Close confirmation dialogs
    const handleCancel = () => {
        setDeleteConfirmationOpen(false);
    };

    // Navigate back to menu list
    const handleBack = () => {
        navigate('/admin/menus');
    };

    // Handle menu deletion
    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false);
        try {
            if (!menuData?.id) {
                throw new Error("Menu ID not available for deletion.");
            }
            await apiDeleteMenu(menuData.id); // Call apiDeleteMenu

            toast.push(
                <Notification type="success" title="Success">
                    Menu deleted successfully!
                </Notification>,
                { placement: 'top-center' },
            );
            navigate('/admin/menus'); // Navigate back to menu list after deletion
        } catch (error) {
            console.error('Error deleting menu:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to delete menu: {error.response?.data?.message || 'Unknown error occurred.'}
                </Notification>,
                { placement: 'top-center' },
            );
        }
    };

    if (isLoading) {
        return (
            <Container className="h-full flex items-center justify-center">
                <div>Loading menu data...</div>
            </Container>
        );
    }

    if (!menuData && !isLoading && !error) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <h3 className="mt-8">No menu found!</h3>
                <Button className="mt-4" onClick={handleBack}>
                    Go back to Menus
                </Button>
            </div>
        );
    }

    return (
        <>
            <MenuForm
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
            </MenuForm>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove menu"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this menu? This action can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default MenuEdit;