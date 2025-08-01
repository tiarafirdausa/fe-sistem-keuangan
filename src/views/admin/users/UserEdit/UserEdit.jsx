// src/views/admin/users/UserEdit/UserEdit.jsx
import { useState, useMemo } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import Spinner from '@/components/ui/Spinner'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import UserForm from '../UserForm'
import {
    apiGetUserById,
    apiUpdateUser,
    apiDeleteUser,
} from '@/services/UserService'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import { useParams, useNavigate } from 'react-router-dom'
import useSWR from 'swr'
import appConfig from '@/configs/app.config'

const UserEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const {
        data: userData,
        isLoading: isLoadingUser,
        error: userError,
        mutate,
    } = useSWR(
        id ? ['user', id] : null,
        async () => {
            try {
                const response = await apiGetUserById(id)
                return response.user
            } catch (err) {
                console.error('Error fetching user by ID:', err)
                if (err.response && err.response.status === 404) {
                    throw new Error('User not found')
                }
                throw err
            }
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
        },
    )

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const defaultFormValues = useMemo(() => {
        if (!userData) {
            return {} 
        }
        const fotoUrl = userData.foto
            ? `${appConfig.backendBaseUrl}${userData.foto}`
            : null
        if (userData) {
            return {
                name: userData.name || '',
                username: userData.username || '',
                email: userData.email || '',
                role: userData.role || '',
                status: userData.status || '',
                foto: fotoUrl
                    ? { img: fotoUrl, name: 'current_foto', id: userData.id }
                    : null,
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: '',
                clear_foto: false,
            }
        }
        return {}
    }, [userData])

    const handleFormSubmit = async (formData) => {
        setIsSubmitting(true)
        try {
            if (!id) {
                throw new Error('User ID not available for update.')
            }

            await apiUpdateUser(id, formData)

            toast.push(
                <Notification type="success" title="Success">
                    User updated successfully!
                </Notification>,
                { placement: 'top-center' },
            )
            mutate()
            navigate('/admin/users')
        } catch (error) {
            console.error(
                'Error updating user:',
                error.response?.data || error.message,
            )
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to update user:{' '}
                    {error.response?.data?.error || 'Unknown error occurred.'}
                </Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleBack = () => {
        navigate('/admin/users')
    }

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false)
        try {
            if (!id) {
                throw new Error('User ID not available for deletion.')
            }
            await apiDeleteUser(id)

            toast.push(
                <Notification type="success" title="Success">
                    User deleted successfully!
                </Notification>,
                { placement: 'top-center' },
            )
            navigate('/admin/users')
        } catch (error) {
            console.error(
                'Error deleting user:',
                error.response?.data || error.message,
            )
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to delete user:{' '}
                    {error.response?.data?.error || 'Unknown error occurred.'}
                </Notification>,
                { placement: 'top-center' },
            )
        }
    }

    const isLoadingCombined = isLoadingUser

    if (isLoadingCombined) {
        return (
            <Container className="h-full flex items-center justify-center">
                <Spinner size={40} />
            </Container>
        )
    }

    if (userError || !userData) {
        return (
            <div className="h-full flex flex-col items-center justify-center">
                <h3 className="mt-8">No user found!</h3>
                <Button className="mt-4" onClick={handleBack}>
                    Go back to Users
                </Button>
            </div>
        )
    }

    return (
        <>
            <UserForm
                defaultValues={defaultFormValues}
                isEdit={true}
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
            </UserForm>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove user"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this user? This action
                    can&apos;t be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default UserEdit
