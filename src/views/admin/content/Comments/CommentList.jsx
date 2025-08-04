import { AdaptiveCard, Container } from "@/components/shared"
import CommentListTableTools from "./CommentList/components/CommentListTableTools"
import CommentListTable from "./CommentList/components/CommentListTable"
import CommentListSelected from "./CommentList/components/CommentListSelected"


const CommentList = () => {
    return (
        <>
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <h3>Comments</h3>
                    </div>
                    <CommentListTableTools/>
                    <CommentListTable/>
                </div>
            </AdaptiveCard>
        </Container> 
        <CommentListSelected/>
        </>
    )
}

export default CommentList
