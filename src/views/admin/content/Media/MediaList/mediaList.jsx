// src/views/admin/content/Media/MediaList.jsx

import Container from '@/components/shared/Container';
import AdaptiveCard from '@/components/shared/AdaptiveCard';
import MediaListTable from './components/MediaListTable';
import MediaListActionTools from './components/MediaListActionTools';
import MediaListTableTools from './components/MediaListTableTools';
import MediaListSelected from './components/MediaListSelected';

const MediaList = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:flex-wrap md:justify-between gap-2">
                            <h3>Media List</h3>
                            <MediaListActionTools />
                        </div>
                        <MediaListTableTools />
                        <MediaListTable/>
                    </div>
                </AdaptiveCard>
            </Container>
            <MediaListSelected />
        </>
    );
};

export default MediaList;