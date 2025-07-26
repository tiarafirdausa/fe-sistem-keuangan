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
        setMenuItemMenuId, // Keep this for setting the store state if needed elsewhere
        selectedMenuItems,
        setSelectedMenuItems,
        setSelectAllMenuItems,
    } = useMenuItemListStore((state) => state);

    // Update the store's menuId, but the SWR key will primarily rely on useParams' menuId
    useEffect(() => {
        const parsedMenuId = parseInt(menuId);
        // Only update if it's a valid number and different from current store state
        if (!isNaN(parsedMenuId) && menuItemTableData.menuId !== parsedMenuId) {
            setMenuItemMenuId(parsedMenuId); // This ensures the store has the correct menuId
        }
    }, [menuId, setMenuItemMenuId, menuItemTableData.menuId]);


    // Modify the SWR key to directly include menuId from useParams
    const swrKey = menuId ? // Only make the fetch if menuId is available
        ['/api/menu-items', { ...menuItemTableData, ...menuItemFilterData, menuId: parseInt(menuId) }]
        : null; // SWR will not fetch if the key is null/falsy

    const { data, error, isLoading, mutate } = useSWR(
        swrKey, 
        // eslint-disable-next-line no-unused-vars
        async ([_, params]) => {
            // The params already include menuId because of the swrKey definition
            const response = await apiGetAllMenuItems(params);
            console.log("Fetched menu items:", response.data);
            return response.data;
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: true,
            // shouldRetryOnError: menuItemTableData.menuId !== null, // This can be simplified
            shouldRetryOnError: !!menuId, // Retry if menuId is present
        },
    );

    // Adjusted logic for menuItemList and menuItemListTotal
    // SWR's `data` will be `undefined` or `null` if swrKey is null or fetcher returns null
   const menuItemList = data || []; // This would assign the array directly if `data` is the array
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