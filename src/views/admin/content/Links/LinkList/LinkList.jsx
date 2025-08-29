import { AdaptiveCard, Container } from '@/components/shared';
import LinkListActionTools from './components/LinkListActionTools';
import LinkListTableTools from './components/LinkListTableTools';
import LinkListTable from './components/LinkListTable';
import LinkListSelected from './components/LinkListSelected';

const LinkList = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Links</h3>
                            <LinkListActionTools />
                        </div>
                        <LinkListTableTools />
                        <LinkListTable />
                    </div>
                </AdaptiveCard>
            </Container>
            <LinkListSelected />
        </>
    );
};

export default LinkList;