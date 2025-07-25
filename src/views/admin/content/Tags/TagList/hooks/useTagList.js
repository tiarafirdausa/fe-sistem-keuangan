// src/hooks/useTagList.js
import { apiGetAllTags } from '@/services/TagService';
import useSWR from 'swr';
import { useTagListStore } from '../store/tagListStore';

const useTagList = () => {
    const {
        tagTableData,
        tagFilterData,
        setTagTableData,
        setTagFilterData,
        selectedTags,
        setSelectedTags,
        setSelectAllTags,
    } = useTagListStore((state) => state);

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/tags', { ...tagTableData, ...tagFilterData }],
        // eslint-disable-next-line no-unused-vars
        async ([_, params]) => {
            const response = await apiGetAllTags(params);
            return response;
        },
        {
            revalidateOnFocus: false,
        },
    );

    const tagList = Array.isArray(data) ? data : []; 
    const tagListTotal = Array.isArray(data) ? data.length : 0; 

    return {
        error,
        isLoading,
        tagTableData,
        tagFilterData,
        mutate,
        tagList, 
        tagListTotal,
        setTagTableData,
        selectedTags,
        setSelectedTags,
        setSelectAllTags,
        setTagFilterData,
    };
};

export default useTagList;