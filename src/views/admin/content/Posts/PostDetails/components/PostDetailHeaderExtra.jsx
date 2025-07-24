import { useParams, useNavigate } from 'react-router'
import Button from '@/components/ui/Button'

const PostDetailHeaderExtra = () => {
    const { slug } = useParams()

    const navigate = useNavigate()

    const handleEditClick = () => {
        navigate(`/admin/posts/edit/${slug}`)
    }

    return (
        <div className="flex items-center gap-2 print:hidden">
            <Button variant="solid" onClick={handleEditClick}>
                Edit
            </Button>
        </div>
    )
}

export default PostDetailHeaderExtra