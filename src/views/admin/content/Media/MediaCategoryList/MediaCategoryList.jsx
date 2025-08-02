import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import MediaCategoryListTable from './components/MediaCategoryListTable'
import MediaCategoryListActionTools from './components/MediaCategoryListActionTools'
import MediaCategoryListSelected from './components/MediaCategoryListSelected'
import MediaCategoryListTableTools from './components/MediaCategoryListTableTools'

const MediaCategoryList = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Media Categories</h3>
                            <MediaCategoryListActionTools />
                        </div>
                        <MediaCategoryListTableTools />
                        <MediaCategoryListTable />
                    </div>
                </AdaptiveCard>
            </Container>
            <MediaCategoryListSelected />
        </>
    )
}

export default MediaCategoryList