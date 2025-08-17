import ModulListSearch from './ModulListSearch'
import useModulList from '../hooks/useModulList'
import cloneDeep from 'lodash/cloneDeep'

const ModulListTableTools = () => {
    const { modulTableData, setModulTableData } = useModulList()

    const handleInputChange = (val) => {
        const newTableData = cloneDeep(modulTableData)
        newTableData.query = val
        newTableData.pageIndex = 1
        setModulTableData(newTableData)
    }

    return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <ModulListSearch onInputChange={handleInputChange} />
        </div>
    )
}

export default ModulListTableTools
