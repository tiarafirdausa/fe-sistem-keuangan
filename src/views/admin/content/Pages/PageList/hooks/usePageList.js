// hooks/usePageList.js
import { apiGetAllPages } from '@/services/PageService';
import useSWR from 'swr';
import { usePageListStore } from '../store/pageListStore';

const usePageList = () => {
    const {
        pageTableData,
        pageFilterData,
        setPageTableData,
        setPageFilterData,
        selectedPages,
        setSelectedPages,
        setSelectAllPages,
    } = usePageListStore((state) => state);

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/pages', { ...pageTableData, ...pageFilterData }],
        // eslint-disable-next-line no-unused-vars
        async ([_, params]) => {
            const response = await apiGetAllPages(params);
            return response;
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: true,
        },
    );

    const pageList = data?.data || []; // Ambil array halaman dari properti 'data'
    const pageListTotal = data?.pagination?.totalItems || 0; 

    return {
        error,
        isLoading,
        pageTableData,
        pageFilterData,
        mutate,
        pageList,
        pageListTotal,
        setPageTableData,
        selectedPages,
        setSelectedPages,
        setSelectAllPages,
        setPageFilterData,
    };
};

export default usePageList;