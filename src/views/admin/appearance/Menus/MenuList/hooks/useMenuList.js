// src/views/admin/appearance/Menus/MenuList/hooks/useMenuList.js
import { apiGetAllMenus } from '@/services/MenuService';
import useSWR from 'swr';
import { useMenuListStore } from '../store/menuListStore';

const useMenuList = () => {
    const {
        menuTableData,
        menuFilterData,
        setMenuTableData,
        setMenuFilterData,
        selectedMenus,
        setSelectedMenus,
        setSelectAllMenus,
    } = useMenuListStore((state) => state);

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/menus', { ...menuTableData, ...menuFilterData }],
        // eslint-disable-next-line no-unused-vars
        async ([_, params]) => {
            const response = await apiGetAllMenus(params); 
            return response.data; 
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: true, 
        },
    );

    const menuList = data || [];
    const menuListTotal = data?.length || 0;

    
    return {
        error,
        isLoading,
        menuTableData,
        menuFilterData,
        mutate, 
        menuList,
        menuListTotal,
        setMenuTableData,
        selectedMenus,
        setSelectedMenus,
        setSelectAllMenus,
        setMenuFilterData,
    };
};

export default useMenuList;