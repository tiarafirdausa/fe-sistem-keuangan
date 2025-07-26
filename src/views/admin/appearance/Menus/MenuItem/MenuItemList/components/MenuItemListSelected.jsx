import { useState } from 'react';
import StickyFooter from '@/components/shared/StickyFooter';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import useMenuItemList from '../hooks/useMenuItemList'; // Import the menu item list hook
import { TbChecks, TbLink } from 'react-icons/tb'; // Changed icon to TbLink for menu items
import { apiDeleteMenuItem } from '@/services/MenuService'; // Assuming a bulk delete API for menu items
import { toast } from '@/components/ui/toast';
import { Avatar } from '@/components/ui/Avatar';

const MenuItemListSelected = () => {
    const {
        selectedMenuItems, // Use selectedMenuItems from the store
        mutate, // To re-fetch menu items after deletion
        setSelectAllMenuItems, // To clear selections after deletion
    } = useMenuItemList(); // Use the menu item list hook

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

    const handleDelete = () => {
        setDeleteConfirmationOpen(true);
    };

    const handleCancel = () => {
        setDeleteConfirmationOpen(false);
    };

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false);
        try {
            await Promise.all(
                selectedMenuItems.map((item) => apiDeleteMenuItem(item.id)) // Call individual delete for each selected item
            );
            mutate(); // Re-fetch the menu item list to update the UI
            setSelectAllMenuItems([]); // Clear all selected menu items

            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<TbLink />} // Changed icon to TbLink
                        className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 mr-2"
                    />
                    <span>Successfully deleted {selectedMenuItems.length} menu item(s)!</span>
                </div>,
                { placement: 'top-center' },
            );
        } catch (error) {
            console.error("Error deleting menu items:", error);
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<TbLink />} // Changed icon to TbLink
                        className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100 mr-2"
                    />
                    <span>Failed to delete menu item(s). Please try again.</span>
                </div>,
                { placement: 'top-center' },
            );
        }
    };

    return (
        <>
            {selectedMenuItems.length > 0 && (
                <StickyFooter
                    className="flex items-center justify-between py-4 bg-white dark:bg-gray-800"
                    stickyClass="-mx-4 sm:-mx-8 border-t border-gray-200 dark:border-gray-700 px-8"
                    defaultClass="container mx-auto px-8 rounded-xl border border-gray-200 dark:border-gray-600 mt-4"
                >
                    <div className="container mx-auto">
                        <div className="flex items-center justify-between">
                            <span>
                                {selectedMenuItems.length > 0 && (
                                    <span className="flex items-center gap-2">
                                        <span className="text-lg text-primary">
                                            <TbChecks />
                                        </span>
                                        <span className="font-semibold flex items-center gap-1">
                                            <span className="heading-text">
                                                {selectedMenuItems.length}{' '}
                                                Menu Item(s)
                                            </span>
                                            <span>selected</span>
                                        </span>
                                    </span>
                                )}
                            </span>

                            <div className="flex items-center">
                                <Button
                                    size="sm"
                                    className="ltr:mr-3 rtl:ml-3"
                                    type="button"
                                    customColorClass={() =>
                                        'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error'
                                    }
                                    onClick={handleDelete}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </div>
                </StickyFooter>
            )}
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove Menu Items"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove these menu items? This action
                    can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default MenuItemListSelected;