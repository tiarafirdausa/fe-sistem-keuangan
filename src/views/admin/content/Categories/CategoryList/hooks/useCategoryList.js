// hooks/useCategoryList.js
import { apiGetAllCategories } from '@/services/CategoryService';
import useSWR from 'swr';
import { useCategoryListStore } from '../store/categoryListStore';

const useCategoryList = () => {
    const {
        categoryTableData,
        categoryFilterData,
        setCategoryTableData,
        setCategoryFilterData,
        selectedCategories,
        setSelectedCategories,
        setSelectAllCategories,
    } = useCategoryListStore((state) => state);

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/categories', { ...categoryTableData, ...categoryFilterData }],
        // eslint-disable-next-line no-unused-vars
        async ([_, params]) => {
            const response = await apiGetAllCategories(params);
            return response;
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: true, 
        },
    );

    const categoryList = data?.categories || [];
    const categoryListTotal = data?.total || 0;

    return {
        error,
        isLoading,
        categoryTableData,
        categoryFilterData,
        mutate,
        categoryList,
        categoryListTotal,
        setCategoryTableData,
        selectedCategories,
        setSelectedCategories,
        setSelectAllCategories,
        setCategoryFilterData,
    };
};

export default useCategoryList;