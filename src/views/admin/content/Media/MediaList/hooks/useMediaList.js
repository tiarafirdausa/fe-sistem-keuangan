// src/views/admin/content/Media/hooks/useMediaList.js

import { apiGetAllMedia } from '@/services/MediaService';
import useSWR from 'swr';
import { useMediaListStore } from '../store/mediaListStore';

const useMediaList = () => { 
    const {
        mediaTableData,
        mediaFilterData,
        setMediaTableData,
        setMediaFilterData,
        setSelectedMedia,
        setSelectAllMedia,
        selectedMedia,
    } = useMediaListStore((state) => state);

    const swrKey = ['/api/media', { ...mediaTableData, ...mediaFilterData }];

    const { data, error, isLoading, mutate } = useSWR(
        swrKey,
        // eslint-disable-next-line no-unused-vars
        async ([_, params]) => {
            const response = await apiGetAllMedia(params);
            return response;
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: true,
            shouldRetryOnError: true,
        },
    );

    const mediaList = data?.data || [];
    const mediaListTotal = data?.total || 0;

    return {
        error,
        isLoading,
        mediaTableData,
        mediaFilterData,
        mutate,
        mediaList,
        mediaListTotal,
        setMediaTableData,
        setMediaFilterData,
        selectedMedia,
        setSelectedMedia,
        setSelectAllMedia,
    };
};

export default useMediaList;