import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import SocialLinkListTable from './components/SocialLinkListTable'
import SocialLinkListActionTools from './components/SocialLinkListActionTools'
import SocialLinkListTableTools from './components/SocialLinkListTableTools'
import SocialLinkListSelected from './components/SocialLinkListSelected'

const SocialLinkList = () => {
    return (
        <>
        <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Social Links</h3>
                            <SocialLinkListActionTools />
                        </div>
                        <SocialLinkListTableTools />
                        <SocialLinkListTable />
                    </div>
                </AdaptiveCard>
            </Container>
            <SocialLinkListSelected/>
        </>
    )
}

export default SocialLinkList