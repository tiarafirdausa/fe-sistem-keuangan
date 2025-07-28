// hooks/usePostList.js
import { apiGetAllPosts } from '@/services/PostService'; 
import useSWR from 'swr';
import { usePostListStore } from '../store/PostListStore';

const usePostList = () => {
    const {
        postTableData,
        postFilterData,
        setPostTableData,
        setPostFilterData,
        selectedPosts,
        setSelectedPosts,
        setSelectAllPosts,
    } = usePostListStore((state) => state);

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/posts', { ...postTableData, ...postFilterData }],
        // eslint-disable-next-line no-unused-vars
        async ([_, params]) => {
            const response = await apiGetAllPosts(params);
            return response;
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: true, 
        },
    );

        const postList = Array.isArray(data) ? data : [];
        const postListTotal = Array.isArray(data) ? data.length : 0;

    return {
        error,
        isLoading,
        postTableData,
        postFilterData,
        mutate,
        postList,
        postListTotal,
        setPostTableData,
        selectedPosts,
        setSelectedPosts,
        setSelectAllPosts,
        setPostFilterData,
    };
};

export default usePostList;