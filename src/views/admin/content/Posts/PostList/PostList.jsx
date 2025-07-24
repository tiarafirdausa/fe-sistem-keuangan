import { AdaptiveCard, Container } from "@/components/shared"
import PostListTable from "./components/PostListTable"
import PostListActionTools from "./components/PostListActionTools"
import PostListSelected from "./components/PostListSelected"
import PostListTableTools from "./components/PostListTableTools"

const PostList = () => {
    return (
        <>
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Post</h3>
                            <PostListActionTools/>
                        </div>
                        <PostListTableTools/>
                        <PostListTable/>
                    </div>
            </AdaptiveCard>
        </Container> 
        <PostListSelected/>
        </>
    )
}

export default PostList