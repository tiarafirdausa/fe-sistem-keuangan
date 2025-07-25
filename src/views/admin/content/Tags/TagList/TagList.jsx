import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import TagListTable from './components/TagListTable'
import TagListActionTools from './components/TagListActionTools'
import TagListSelected from './components/TagListSelected'
import TagListTableTools from './components/TagListTableTools'

const TagList = () => {
    return (
        <>
        <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Tags</h3>
                            <TagListActionTools />
                        </div>
                        <TagListTableTools />
                        <TagListTable />
                    </div>
                </AdaptiveCard>
            </Container>
            <TagListSelected/>
        </>
    )
}

export default TagList