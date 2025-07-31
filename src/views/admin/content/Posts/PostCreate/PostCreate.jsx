// src/views/admin/content/Posts/PostCreate/PostCreate.jsx
import { useState, useEffect } from 'react';
import Container from '@/components/shared/Container';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import Spinner from '@/components/ui/Spinner';
import PostForm from '../PostForm';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { TbTrash } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { apiCreatePost } from '@/services/PostService';
import { apiGetAllCategories } from '@/services/CategoryService';
import { apiGetAllTags } from '@/services/TagService';
import { POST_DEFAULT_VALUES } from '../PostForm/constants';
import { useAuth } from '@/auth'; 

const PostCreate = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingData(true);
                const [categoriesRes, tagsRes] = await Promise.all([
                    apiGetAllCategories(),
                    apiGetAllTags(),
                ]);
                setCategories(categoriesRes.categories);
                setTags(tagsRes.tags);
            } catch (error) {
                console.error('Error fetching initial data for post form:', error);
                toast.push(
                    <Notification type="danger" title="Error">
                        Failed to load form data: {error.message || 'Unknown error.'}
                    </Notification>,
                    { placement: 'top-center' },
                );
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, []);

    const handleFormSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            const responseData = await apiCreatePost(formData);

            if (responseData) {
                toast.push(
                    <Notification type="success" title="Success">
                        Post &quot;{responseData.title || 'Untitled Post'}&quot; created successfully!
                    </Notification>,
                    { placement: 'top-center' },
                );
                navigate('/admin/posts');
            } else {
                toast.push(
                    <Notification type="warning" title="Unexpected Response">
                        Post created but response was unexpected. Please check manually.
                    </Notification>,
                    { placement: 'top-center' },
                );
            }
        } catch (error) {
            console.error('Error creating post in frontend:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to create post: {error.response?.data?.error || 'Unknown error occurred.'}
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
                Post creation discarded.
            </Notification>,
            { placement: 'top-center' },
        );
        navigate('/admin/posts');
    };

    const handleDiscard = () => {
        setDiscardConfirmationOpen(true);
    };

    const handleCancel = () => {
        setDiscardConfirmationOpen(false);
    };

    if (loadingData) {
        return (
            <Container className="h-full flex items-center justify-center">
                <Spinner size={40} />
            </Container>
        );
    }

    return (
        <>
            <PostForm
                defaultValues={POST_DEFAULT_VALUES}
                categories={categories}
                tags={tags}
                currentUser={user}
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
                                Create Post
                            </Button>
                        </div>
                    </div>
                </Container>
            </PostForm>
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
                    Are you sure you want to discard this post? This action cannot
                    be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default PostCreate;