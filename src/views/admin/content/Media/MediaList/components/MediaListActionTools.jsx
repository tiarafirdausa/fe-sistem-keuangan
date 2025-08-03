// src/views/admin/content/Media/MediaList/components/MediaListActionTools.jsx

import Button from '@/components/ui/Button'
import { TbPlus } from 'react-icons/tb'
import { useNavigate, useSearchParams } from 'react-router-dom'

const MediaListActionTools = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const categoryId = searchParams.get('categoryId')

    const newMediaUrl = categoryId
        ? `/admin/media/new?categoryId=${categoryId}`
        : '/admin/media/new'

    return (
        <div className="flex flex-col md:flex-row gap-3">
            <Button
                variant="solid"
                icon={<TbPlus className="text-xl" />}
                onClick={() => navigate(newMediaUrl)}
            >
                Add Media
            </Button>
        </div>
    )
}

export default MediaListActionTools