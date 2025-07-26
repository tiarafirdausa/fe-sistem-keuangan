// src/stores/menuItemListStore.js
import { create } from 'zustand'

export const initialMenuItemTableData = {
    pageIndex: 1,
    pageSize: 10,
    query: '', 
    sort: {
        order: '',
        key: '',
    },
    menuId: null, 
}

export const initialMenuItemFilterData = {
    type: '', 
    parentId: null, 
}

const initialMenuItemState = {
    menuItemTableData: initialMenuItemTableData,
    menuItemFilterData: initialMenuItemFilterData,
    selectedMenuItems: [], 
}

export const useMenuItemListStore = create((set) => ({
    ...initialMenuItemState,
    setMenuItemFilterData: (payload) => set((state) => ({ 
        menuItemFilterData: { ...state.menuItemFilterData, ...payload } 
    })),
    setMenuItemTableData: (payload) => set((state) => ({ 
        menuItemTableData: { ...state.menuItemTableData, ...payload } 
    })),
    setMenuItemMenuId: (menuId) => set((state) => ({ 
        menuItemTableData: { ...state.menuItemTableData, menuId, pageIndex: 1 } 
    })),
    setSelectedMenuItems: (checked, menuItem) =>
        set((state) => {
            const prevSelectedMenuItems = state.selectedMenuItems
            if (checked) {
                if (!prevSelectedMenuItems.some((prevItem) => menuItem.id === prevItem.id)) {
                    return { selectedMenuItems: [...prevSelectedMenuItems, menuItem] }
                }
            } else {
                return {
                    selectedMenuItems: prevSelectedMenuItems.filter(
                        (prevItem) => prevItem.id !== menuItem.id,
                    ),
                }
            }
            return { selectedMenuItems: prevSelectedMenuItems }; 
        }),
    setSelectAllMenuItems: (menuItems) => set(() => ({ selectedMenuItems: menuItems })),
    resetMenuItemListStore: () => set(initialMenuItemState),
}))