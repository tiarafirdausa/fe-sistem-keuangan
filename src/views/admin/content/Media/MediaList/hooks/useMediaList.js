import { apiGetAllMediaCollections } from '@/services/MediaService';
import useSWR from 'swr';
import { useMediaListStore } from '../store/mediaListStore';

const useMediaList = () => {
    const {
        mediaTableData,
        mediaFilterData,
        setMediaTableData,
        setMediaFilterData,
        selectedMediaCollections,
        setSelectedMediaCollections,
        setSelectAllMediaCollections,
    } = useMediaListStore((state) => state);

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/media', { ...mediaTableData, ...mediaFilterData }],
        // eslint-disable-next-line no-unused-vars
        async ([_, params]) => {
            const response = await apiGetAllMediaCollections(params);
            return response;
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: true,
        },
    );

    const mediaCollectionList = data?.data || [];
    const mediaListTotal = data?.pagination?.totalItems || 0;

    return {
        error,
        isLoading,
        mediaTableData,
        mediaFilterData,
        mutate,
        mediaCollectionList,
        mediaListTotal,
        setMediaTableData,
        selectedMediaCollections,
        setSelectedMediaCollections,
        setSelectAllMediaCollections,
        setMediaFilterData,
    };
};

export default useMediaList;