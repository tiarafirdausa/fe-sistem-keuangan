import { useState } from 'react';
import Container from '@/components/shared/Container';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import MenuItemForm from '../MenuItemForm'; 
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { TbTrash } from 'react-icons/tb';
import { useParams, useNavigate } from 'react-router-dom';
import { apiCreateMenuItem } from '@/services/MenuService'; 

const MenuItemCreate = () => {
    const { menuId } = useParams();
    const navigate = useNavigate();

    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormSubmit = async (values) => {
        setIsSubmitting(true);
        try {
            const payload = { ...values, menu_id: Number(menuId) };
            const responseData = await apiCreateMenuItem(payload);

            if (responseData) {
                toast.push(
                    <Notification type="success" title="Success">
                        Menu Item &quot;{responseData.title || 'Untitled Item'}&quot; created successfully!
                    </Notification>,
                    { placement: 'top-center' },
                );
                navigate(`/admin/menus/${menuId}/items`); 
            } else {
                toast.push(
                    <Notification type="warning" title="Unexpected Response">
                        Menu item created but response was unexpected. Please check manually.
                    </Notification>,
                    { placement: 'top-center' },
                );
            }
        } catch (error) {
            console.error('Error creating menu item in frontend:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to create menu item: {error.response?.data?.message || 'Unknown error occurred.'}
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
                Menu item creation discarded.
            </Notification>,
            { placement: 'top-center' },
        );
        navigate(`/admin/menus/${menuId}/items`); 
    };

    const handleDiscard = () => {
        setDiscardConfirmationOpen(true);
    };

    const handleCancel = () => {
        setDiscardConfirmationOpen(false);
    };

    return (
        <>
            <MenuItemForm
                defaultValues={{
                    menu_id: Number(menuId), 
                    parent_id: null,
                    title: '',
                    url: '',
                    type: 'custom',
                    reference_id: null,
                    target: '_self',
                    order: 0,
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
                                Create Menu Item
                            </Button>
                        </div>
                    </div>
                </Container>
            </MenuItemForm>
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
                    Are you sure you want to discard this new menu item? This action cannot
                    be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default MenuItemCreate;