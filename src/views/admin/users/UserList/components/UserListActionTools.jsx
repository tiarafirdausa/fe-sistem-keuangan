// src/views/content/Users/UserList/components/UserListActionTools.jsx
import Button from '@/components/ui/Button'
import { TbPlus } from 'react-icons/tb' 
import { useNavigate } from 'react-router-dom'

const UserListActionTools = () => {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <Button
                variant="solid"
                icon={<TbPlus className="text-xl" />}
                onClick={() => navigate('/admin/users/new')} 
            >
                Add User
            </Button>
        </div>
    )
}

export default UserListActionTools