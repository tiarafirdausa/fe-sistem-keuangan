import { useState } from 'react';
import Container from '@/components/shared/Container';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import MenuItemForm from '../MenuItemForm'; 
import { apiGetMenuItemById, apiUpdateMenuItem, apiDeleteMenuItem } from '@/services/MenuService'; 
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb';
import { useParams, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { useAuth } from '@/auth';
import useAuthority from '@/utils/hooks/useAuthority';
import { ADMIN } from '@/constants/roles.constant';

const MenuItemEdit = () => {
    const { menuId, id: itemId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const canDelete = useAuthority(user?.role ? [user.role] : [], [ADMIN]);

    const { data: menuItemData, isLoading, error, mutate } = useSWR(
        itemId ? ['/menu-items/id', itemId] : null, 
        // eslint-disable-next-line no-unused-vars
        ([_, menuIdParam]) => apiGetMenuItemById(menuIdParam), 
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    );

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getDefaultValues = () => {
        if (menuItemData) {
            const { menu_id, parent_id, title, url, type, reference_id, target, order } = menuItemData;
            return {
                menu_id,
                parent_id: parent_id ? parent_id : null,
                title,
                url: url || '', 
                type,
                reference_id: reference_id ? reference_id : null,
                target,
                order,
            };
        }
        return {};
    };

    const handleFormSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            if (!itemId) {
                throw new Error("Menu Item ID not available for update.");
            }
            await apiUpdateMenuItem(itemId, { ...values, menu_id: Number(menuId) });

            toast.push(
                <Notification type="success" title="Success">
                    Menu item updated successfully!
                </Notification>,
                { placement: 'top-center' },
            );
            mutate();
            navigate(`/admin/menus/${menuId}/items`); 
        } catch (error) {
            console.error('Error updating menu item:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to update menu item: {error.response?.data?.message || 'Unknown error occurred.'}
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
        navigate(`/admin/menus/${menuId}/items`);
    };

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false);
        try {
            if (!itemId) {
                throw new Error("Menu Item ID not available for deletion.");
            }
            await apiDeleteMenuItem(itemId); 

            toast.push(
                <Notification type="success" title="Success">
                    Menu item deleted successfully!
                </Notification>,
                { placement: 'top-center' },
            );
            navigate(`/admin/menus/${menuId}/items`); 
        } catch (error) {
            console.error('Error deleting menu item:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to delete menu item: {error.response?.data?.message || 'Unknown error occurred.'}
                </Notification>,
                { placement: 'top-center' },
            );
        }
    };

    if (isLoading) {
        return (
            <Container className="h-full flex items-center justify-center">
                <div>Loading menu item data...</div>
            </Container>
        );
    }

    if (!menuItemData && !isLoading && !error) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <h3 className="mt-8">No menu item found!</h3>
                <Button className="mt-4" onClick={handleBack}>
                    Go back to Menu Items
                </Button>
            </div>
        );
    }

    return (
        <>
            <MenuItemForm
                menuId={Number(menuId)}
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
            </MenuItemForm>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove menu item"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this menu item? This action can&apos;t be undone.
                    Any child menu items will become top-level items.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default MenuItemEdit;