import { apiGetAllPosts } from "@/services/PostService";
import { usePostListStore } from "../store/postListStore";
import useSWR from "swr";

const usePostList = () => {
    const {
        tableData,
        filterData,
        setTableData,
        setFilterData,
        selectedPost,
        setSelectedPost,
        setSelectAllPost,
    } = usePostListStore((state) => state)

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/posts', { ...tableData, ...filterData }],
        async ([_,params]) => {
            const response = await apiGetAllPosts(params);
            return response;
        },
        {
            revalidateOnFocus: false,
        },
    )

    // Baris-baris ini sudah benar, karena 'data' dari SWR sekarang akan langsung berupa array
    const postList = Array.isArray(data) ? data : [];
    const postListTotal = Array.isArray(data) ? data.length : 0;

    return {
        error,
        isLoading,
        tableData,
        filterData,
        mutate,
        postList,
        postListTotal,
        setTableData,
        selectedPost,
        setSelectedPost,
        setSelectAllPost,
        setFilterData,
    }
}

export default usePostList