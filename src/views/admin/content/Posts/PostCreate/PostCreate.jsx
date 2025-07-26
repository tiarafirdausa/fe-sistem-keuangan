// src/views/admin/content/Posts/PostCreate/PostCreate.jsx
import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import PostForm from '../PostForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbTrash } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import { apiCreatePost } from '@/services/PostService'

const PostCreate = () => {
    const navigate = useNavigate()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleFormSubmit = async (values) => {
        setIsSubmitting(true)
        try {
            const responseData = await apiCreatePost(values)

            if (responseData) {
                toast.push(
                    <Notification type="success" title="Success">
                        Post {responseData.title || 'Untitled Post'} created
                        successfully!
                    </Notification>,
                    { placement: 'top-center' },
                )
                navigate('/admin/posts')
            } else {
                toast.push(
                    <Notification type="warning" title="Unexpected Response">
                        Post created but response was unexpected. Please check
                        manually.
                    </Notification>,
                    { placement: 'top-center' },
                )
            }
        } catch (error) {
            console.error(
                'Error creating post in frontend:',
                error.response?.data || error.message,
            )
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to create post:{' '}
                    {error.response?.data?.message || 'Unknown error occurred.'}
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(false)
        toast.push(
            <Notification type="info" title="Discarded">
                Post creation discarded.
            </Notification>,
            { placement: 'top-center' },
        )
        navigate('/admin/posts')
    }

    const handleDiscard = () => {
        setDiscardConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDiscardConfirmationOpen(false)
    }

    return (
        <>
            <PostForm
                newPost
                defaultValues={{
                    title: '',
                    slug: '',
                    excerpt: '',
                    content: '',
                    author_id: 1,
                    status: 'draft',
                    published_at: null,
                    featured_image_file: null,
                    existing_featured_image_path: null,
                    clear_featured_image: false,
                    gallery_image_files: [],
                    existing_gallery_images: [],
                    delete_gallery_image_ids: [],
                    clear_all_gallery_images: false,
                    meta_title: '',
                    meta_description: '',
                    categories: [],
                    tags: [],
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
                    Are you sure you want to discard this post? This action
                    cannot be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default PostCreate
