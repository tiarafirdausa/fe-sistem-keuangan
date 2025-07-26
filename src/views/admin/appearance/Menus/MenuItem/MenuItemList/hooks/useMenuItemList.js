// src/views/admin/appearance/Menus/MenuItems/MenuItemList/hooks/useMenuItemList.js
import { apiGetAllMenuItems } from '@/services/MenuService';
import useSWR from 'swr';
import { useMenuItemListStore } from '../store/menuItemListStore';
import { useEffect } from 'react';

const useMenuItemList = (passedMenuId) => {
    const menuId = passedMenuId;     

    const {
        menuItemTableData,
        menuItemFilterData,
        setMenuItemTableData,
        setMenuItemFilterData,
        setMenuItemMenuId,
        selectedMenuItems,
        setSelectedMenuItems,
        setSelectAllMenuItems,
    } = useMenuItemListStore((state) => state);

    useEffect(() => {
        const parsedMenuId = parseInt(menuId);
        if (!isNaN(parsedMenuId) && menuItemTableData.menuId !== parsedMenuId) {
            setMenuItemMenuId(parsedMenuId); 
        }
    }, [menuId, setMenuItemMenuId, menuItemTableData.menuId]);


    const swrKey = menuId ? 
        ['/api/menu-items', { ...menuItemTableData, ...menuItemFilterData, menuId: parseInt(menuId) }]
        : null; 

    const { data, error, isLoading, mutate } = useSWR(
        swrKey, 
        // eslint-disable-next-line no-unused-vars
        async ([_, params]) => {
            const response = await apiGetAllMenuItems(params);
            return response.data;
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: true,
            shouldRetryOnError: !!menuId, 
        },
    );

    const menuItemList = data || []; 
    const menuItemListTotal = data?.length || 0; 

    return {
        error,
        isLoading,
        menuItemTableData,
        menuItemFilterData,
        mutate,
        menuItemList,
        menuItemListTotal,
        setMenuItemTableData,
        setMenuItemFilterData,
        selectedMenuItems,
        setSelectedMenuItems,
        setSelectAllMenuItems,
    };
};

export default useMenuItemList;