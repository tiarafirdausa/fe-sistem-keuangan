import { apiGetAllModuls } from '@/services/modulService' 
import useSWR from 'swr'
import { useModulListStore } from '../store/modulListStore'

const useModulList = () => {
    const {
        modulTableData,
        modulFilterData,
        setModulTableData,
        setModulFilterData,
        selectedModuls,
        setSelectedModuls,
        setSelectAllModuls,
    } = useModulListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/moduls', { ...modulTableData, ...modulFilterData }],
        // eslint-disable-next-line no-unused-vars
        async ([_, params]) => {
            const response = await apiGetAllModuls(params)
            console.log(response)
            return response
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: true,
        },
    )

    const modulList = data?.moduls || []
    const modulListTotal = data?.total || 0

    return {
        error,
        isLoading,
        modulTableData,
        modulFilterData,
        mutate,
        modulList,
        modulListTotal,
        setModulTableData,
        selectedModuls,
        setSelectedModuls,
        setSelectAllModuls,
        setModulFilterData,
    }
}

export default useModulList
