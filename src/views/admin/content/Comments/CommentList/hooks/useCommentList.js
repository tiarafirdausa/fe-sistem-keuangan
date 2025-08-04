// hooks/useCommentList.js
import { apiGetAllComments } from '@/services/CommentService';
import useSWR from 'swr';
import { useCommentListStore } from '../store/commentListStore';

const useCommentList = () => {
    const {
        commentTableData,
        commentFilterData,
        setCommentTableData,
        setCommentFilterData,
        selectedComments,
        setSelectedComments,
        setSelectAllComments,
    } = useCommentListStore((state) => state);

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/comments', { ...commentTableData, ...commentFilterData }],
        // eslint-disable-next-line no-unused-vars
        async ([_, params]) => {
            const response = await apiGetAllComments(params);
            return response;
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: true,
        },
    );

    const commentList = data?.data || [];
    const commentListTotal = data?.pagination?.totalItems || 0; 

    return {
        error,
        isLoading,
        commentTableData,
        commentFilterData,
        mutate,
        commentList,
        commentListTotal,
        setCommentTableData,
        selectedComments,
        setSelectedComments,
        setSelectAllComments,
        setCommentFilterData,
    };
};

export default useCommentList;
