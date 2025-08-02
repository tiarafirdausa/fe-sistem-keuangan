import { apiGetAllMediaCategories } from '@/services/MediaService';
import useSWR from 'swr';
import { useMediaCategoryListStore } from '../store/mediaCategoryListStore';

const useMediaCategoryList = () => {
    const {
        mediaCategoryTableData,
        mediaCategoryFilterData,
        setMediaCategoryTableData,
        setMediaCategoryFilterData,
        selectedMediaCategories,
        setSelectedMediaCategories,
        setSelectAllMediaCategories,
    } = useMediaCategoryListStore((state) => state);

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/media-categories', { ...mediaCategoryTableData, ...mediaCategoryFilterData }], 
        // eslint-disable-next-line no-unused-vars
        async ([_, params]) => {
            const response = await apiGetAllMediaCategories(params); 
            return response; 
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: true, 
        },
    );

    const mediaCategoryList = data?.mediaCategories || []; 
    const mediaCategoryListTotal = data?.total || 0;

    return {
        error,
        isLoading,
        mediaCategoryTableData,
        mediaCategoryFilterData,
        mutate,
        mediaCategoryList,
        mediaCategoryListTotal,
        setMediaCategoryTableData,
        selectedMediaCategories,
        setSelectedMediaCategories,
        setSelectAllMediaCategories,
        setMediaCategoryFilterData,
    };
};

export default useMediaCategoryList;