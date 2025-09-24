import { useState } from 'react';
import StickyFooter from '@/components/shared/StickyFooter';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import useTagList from '../hooks/useTagList'; 
import { TbChecks, TbTag } from 'react-icons/tb'; 
import { apiDeleteTag } from '@/services/TagService'; 
import { toast } from '@/components/ui/toast';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/auth';
import useAuthority from '@/utils/hooks/useAuthority';
import { ADMIN } from '@/constants/roles.constant';

const TagListSelected = () => {
    const {
        selectedTags, 
        mutate,
        setSelectAllTags,
    } = useTagList();
    const { user } = useAuth();
    const canDelete = useAuthority(user?.role ? [user.role] : [], [ADMIN]);
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
                selectedTags.map((tag) => apiDeleteTag(tag.id)) 
            );
            mutate(); 
            setSelectAllTags([]); 

            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<TbTag />} 
                        className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 mr-2"
                    />
                    <span>Successfully deleted {selectedTags.length} tag(s)!</span> 
                </div>
            );
        } catch (error) {
            console.error("Error deleting tags:", error);
            toast.push(
                <div className="flex items-center">
                    <Avatar
                        shape="circle"
                        icon={<TbTag />} 
                        className="bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100 mr-2"
                    />
                    <span>Failed to delete tag(s). Please try again.</span>
                </div>
            );
        }
    };

    return (
        <>
            {selectedTags.length > 0 && (
                <StickyFooter
                    className="flex items-center justify-between py-4 bg-white dark:bg-gray-800"
                    stickyClass="-mx-4 sm:-mx-8 border-t border-gray-200 dark:border-gray-700 px-8"
                    defaultClass="container mx-auto px-8 rounded-xl border border-gray-200 dark:border-gray-600 mt-4"
                >
                    <div className="container mx-auto">
                        <div className="flex items-center justify-between">
                            <span>
                                {selectedTags.length > 0 && (
                                    <span className="flex items-center gap-2">
                                        <span className="text-lg text-primary">
                                            <TbChecks />
                                        </span>
                                        <span className="font-semibold flex items-center gap-1">
                                            <span className="heading-text">
                                                {selectedTags.length}{' '}
                                                Tag(s) 
                                            </span>
                                            <span>selected</span>
                                        </span>
                                    </span>
                                )}
                            </span>
                            {canDelete && (
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
                            )}
                        </div>
                    </div>
                </StickyFooter>
            )}
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove tags" 
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove these tags? This action
                    can&apos;t be undone.
                </p> 
            </ConfirmDialog>
        </>
    );
};

export default TagListSelected;