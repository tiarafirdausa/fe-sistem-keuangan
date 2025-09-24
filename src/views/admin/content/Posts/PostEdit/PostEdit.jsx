// src/views/admin/content/Posts/PostEdit/PostEdit.jsx
import { useState, useMemo } from 'react';
import Container from '@/components/shared/Container';
import Button from '@/components/ui/Button';
import Notification from '@/components/ui/Notification';
import toast from '@/components/ui/toast';
import Spinner from '@/components/ui/Spinner';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import PostForm from '../PostForm';
import appConfig from '@/configs/app.config';
import {
    apiGetPostBySlug,
    apiUpdatePost,
    apiDeletePost,
} from '@/services/PostService';
import { apiGetAllCategories } from '@/services/CategoryService';
import { apiGetAllTags } from '@/services/TagService';
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb';
import { useParams, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { useAuth } from '@/auth';
import useAuthority from '@/utils/hooks/useAuthority';
import { ADMIN } from '@/constants/roles.constant';

const PostEdit = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const { user } = useAuth();
    const canDelete = useAuthority(user?.role ? [user.role] : [], [ADMIN]);

    const { data: postData, isLoading: isLoadingPost, error: postError, mutate } = useSWR(
        slug ? ['/posts/slug', slug] : null,
        // eslint-disable-next-line no-unused-vars
        async ([_, postSlug]) => {
            try {
                const response = await apiGetPostBySlug(postSlug);
                return response;
            } catch (err) {
                console.error("Error fetching post by slug:", err);
                throw err;
            }
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    );

    const { data: categoriesData, isLoading: isLoadingCategories } = useSWR(
        '/api/categories',
        async () => {
            const response = await apiGetAllCategories({ pageSize: 9999 });
            return response.data;
        },
        { revalidateOnFocus: false, revalidateIfStale: false }
    );

    const { data: tagsData, isLoading: isLoadingTags } = useSWR(
        '/api/tags',
        async () => {
            const response = await apiGetAllTags({ pageSize: 9999 });
            return response.tags;
        },
        { revalidateOnFocus: false, revalidateIfStale: false }
    );

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const defaultFormValues = useMemo(() => {
        if (postData) {
            return {
                title: postData.title || '',
                slug: postData.slug || '',
                excerpt: postData.excerpt || '',
                content: postData.content || '',
                featured_image: postData.featured_image
                    ? { 
                        id: 'existing-featured', 
                        img: `${appConfig.backendBaseUrl}${postData.featured_image}`, 
                        name: 'featured_image' }
                    : null,
                gallery_images: postData.gallery_images?.map(img => {
                    const fullImageUrl = `${appConfig.backendBaseUrl}${img.image_path}`;
                    return {
                        id: img.id,
                        img: fullImageUrl,
                        name: img.alt_text || `gallery_image_${img.id}`
                    };
                }) || [],
                meta_title: postData.meta_title || '',
                meta_description: postData.meta_description || '',
                author_id: postData.author_id,
                author_name: postData.author_name,
                status: postData.status || 'draft',
                published_at: postData.published_at ? new Date(postData.published_at) : null,
                categories: postData.category ? postData.category.id : null, 
                tags: postData.tags?.map(tag => tag.id) || [],
                clear_featured_image: false,
                delete_gallery_image_ids: [],
                clear_gallery_images: false,
            };
        }
        return {};
    }, [postData]);


    const handleFormSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            if (!postData?.id) {
                throw new Error("Post ID not available for update.");
            }

            await apiUpdatePost(postData.id, formData);

            toast.push(
                <Notification type="success" title="Success">
                    Post updated successfully!
                </Notification>,
                { placement: 'top-center' },
            );
            mutate();
            navigate('/admin/posts');
        } catch (error) {
            console.error('Error updating post:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to update post: {error.response?.data?.error || 'Unknown error occurred.'}
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
        navigate('/admin/posts');
    };

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false);
        try {
            if (!postData?.id) {
                throw new Error("Post ID not available for deletion.");
            }
            await apiDeletePost(postData.id);

            toast.push(
                <Notification type="success" title="Success">
                    Post deleted successfully!
                </Notification>,
                { placement: 'top-center' },
            );
            navigate('/admin/posts');
        } catch (error) {
            console.error('Error deleting post:', error.response?.data || error.message);
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to delete post: {error.response?.data?.error || 'Unknown error occurred.'}
                </Notification>,
                { placement: 'top-center' },
            );
        }
    };

    const isLoadingCombined = isLoadingPost || isLoadingCategories || isLoadingTags;
    
    if (isLoadingCombined || !postData) {
        return (
            <Container className="h-full flex items-center justify-center">
                <Spinner size={40} />
            </Container>
        );
    }
    
    if (postError) {
         return (
             <div className="h-full flex flex-col items-center justify-center">
                 <h3 className="mt-8">No post found!</h3>
                 <Button className="mt-4" onClick={handleBack}>
                     Go back to Posts
                 </Button>
             </div>
         );
     }
    

    return (
        <>
            <PostForm
                defaultValues={defaultFormValues}
                categories={categoriesData || []}
                tags={tagsData || []}
                currentUser={currentUser}
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
            </PostForm>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove post"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this post? This action can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    );
};

export default PostEdit;