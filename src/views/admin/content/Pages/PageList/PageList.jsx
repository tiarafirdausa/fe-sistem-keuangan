import { AdaptiveCard, Container } from "@/components/shared"
import PageListActionTools from "./components/PageListActionTools"
import PageListTableTools from "./components/PageListTableTools"
import PageListTable from "./components/PageListTable"
import PageListSelected from "./components/PageListSelected"


const PageList = () => {
    return (
        <>
        <Container>
            <AdaptiveCard>
                <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Pages</h3>
                            <PageListActionTools/>
                        </div>
                        <PageListTableTools/>
                        <PageListTable/>
                    </div>
            </AdaptiveCard>
        </Container> 
        <PageListSelected/>
        </>
    )
}

export default PageList