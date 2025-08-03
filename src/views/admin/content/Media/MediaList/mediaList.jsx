import { AdaptiveCard, Container } from "@/components/shared";
import MediaListActionTools from "./components/MediaListActionTools";
import MediaListTableTools from "./components/MediaListTableTools";
import MediaListTable from "./components/MediaListTable";
import MediaListSelected from "./components/MediaListSelected";

const MediaList = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Media</h3>
                            <MediaListActionTools/>
                        </div>
                        <MediaListTableTools/>
                        <MediaListTable/>
                    </div>
                </AdaptiveCard>
            </Container>
            <MediaListSelected/>
        </>
    );
};

export default MediaList;