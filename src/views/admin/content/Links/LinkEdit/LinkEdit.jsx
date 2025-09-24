import { useState, useMemo } from 'react';
import Container from '@/components/shared/Container';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import Spinner from '@/components/ui/Spinner';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import LinkForm from '../LinkForm';
import {
    apiGetLinkById,
    apiUpdateLink,
    apiDeleteLink,
} from '@/services/LinkService';
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb';
import { useParams, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import appConfig from '@/configs/app.config';
import { useAuth } from '@/auth';
import useAuthority from '@/utils/hooks/useAuthority';
import { ADMIN } from '@/constants/roles.constant';

const LinkEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const canDelete = useAuthority(user?.role ? [user.role] : [], [ADMIN]);

    const { data: linkData, isLoading: isLoadingLink, error: linkError, mutate } = useSWR(
        id ? ['/links/id', id] : null,
        // eslint-disable-next-line no-unused-vars
        async ([_, linkId]) => {
            try {
                const response = await apiGetLinkById(linkId);
                return response;
            } catch (err) {
                console.error("Error fetching link by ID:", err);
                throw err;
            }
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    );

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const defaultFormValues = useMemo(() => {
        if (linkData) {
            return {
                judul: linkData.judul || '', 
                keterangan: linkData.keterangan || '', 
                kategori: linkData.kategori || '',
                link: linkData.link || '',
                gambar: linkData.gambar
                    ? {
                        id: 'existing-featured',
                        img: `${appConfig.backendBaseUrl}${linkData.gambar}`,
                        name: 'gambar'
                    }
                    : null,
                clear_gambar: false,
            };
        }
        return {};
    }, [linkData]); 

    const handleFormSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            if (!linkData?.id) {
                throw new Error("Link ID not available for update.");
            }
            await apiUpdateLink(linkData.id, formData);

            toast.push(
                <Notification type="success" title="Success">
                    Link updated successfully!
                </Notification>,
                { placement: 'top-center' },
            );
            mutate();
            navigate('/admin/links');
        } catch (error) {
            console.error('Error updating link:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to update link: {error.response?.data?.error || 'Unknown error occurred.'}
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
        navigate('/admin/links');
    };

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false);
        try {
            if (!linkData?.id) {
                throw new Error("Link ID not available for deletion.");
            }
            await apiDeleteLink(linkData.id);

            toast.push(
                <Notification type="success" title="Success">
                    Link deleted successfully!
                </Notification>,
                { placement: 'top-center' },
            );
            navigate('/admin/links');
        } catch (error) {
            console.error('Error deleting link:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to delete link: {error.response?.data?.error || 'Unknown error occurred.'}
                </Notification>,
                { placement: 'top-center' },
            );
        }
    };

    const isLoadingCombined = isLoadingLink;

    if (isLoadingCombined) {
        return (
            <Container className="h-full flex items-center justify-center">
                <Spinner size={40} />
            </Container>
        );
    }

    if (linkError || !linkData) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <h3 className="mt-8">No link found!</h3>
                <Button className="mt-4" onClick={handleBack}>
                    Go back to Links
                </Button>
            </div>
        );
    }

    return (
        <>
            <LinkForm
                defaultValues={defaultFormValues}
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
            </LinkForm>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove link"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this link? This action can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default LinkEdit;