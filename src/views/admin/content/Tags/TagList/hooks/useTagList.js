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
        // Kunci SWR ini memastikan re-fetch jika tagTableData (termasuk query) berubah
        ['/api/tags', { ...tagTableData, ...tagFilterData }], 
        //
        async ([_, params]) => {
            const response = await apiGetAllTags(params); //
            // Backend seharusnya mengembalikan object { tags: [...], total: N }
            return response; // Mengembalikan seluruh objek respons dari backend
        },
        {
            revalidateOnFocus: false,
            // revalidateIfStale: false, // Pertimbangkan untuk ini true untuk konsistensi data
        },
    );

    // MODIFIKASI: Pastikan untuk mengakses data.tags dan data.total
    const tagList = data?.tags || []; // Mengambil array 'tags' dari respons backend
    const tagListTotal = data?.total || 0; // Mengambil 'total' dari respons backend untuk paginasi

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