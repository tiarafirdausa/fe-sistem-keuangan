import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import ModulListTable from './components/ModulListTable'
import ModulListActionTools from './components/ModulListActionTools'
import ModulListSelected from './components/ModulListSelected'
import ModulListTableTools from './components/ModulListTableTools'

const ModulList = () => {
    return (
        <>
            <Container>
                <AdaptiveCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <h3>Moduls</h3>
                            <ModulListActionTools />
                        </div>
                        <ModulListTableTools />
                        <ModulListTable />
                    </div>
                </AdaptiveCard>
            </Container>
            <ModulListSelected />
        </>
    )
}

export default ModulList
