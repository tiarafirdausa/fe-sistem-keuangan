// src/stores/menuListStore.js
import { create } from 'zustand'

export const initialMenuTableData = {
    pageIndex: 1,
    pageSize: 10,
    query: '', 
    sort: {
        order: '',
        key: '',
    },
}

export const initialMenuFilterData = {

}

const initialMenuState = {
    menuTableData: initialMenuTableData,
    menuFilterData: initialMenuFilterData,
    selectedMenus: [], 
}

export const useMenuListStore = create((set) => ({
    ...initialMenuState,
    setMenuFilterData: (payload) => set(() => ({ menuFilterData: payload })),
    setMenuTableData: (payload) => set(() => ({ menuTableData: payload })),
    setSelectedMenus: (checked, menu) =>
        set((state) => {
            const prevSelectedMenus = state.selectedMenus
            if (checked) {
                if (!prevSelectedMenus.some((prevMenu) => menu.id === prevMenu.id)) {
                    return { selectedMenus: [...prevSelectedMenus, menu] }
                }
            } else {
                return {
                    selectedMenus: prevSelectedMenus.filter(
                        (prevMenu) => prevMenu.id !== menu.id,
                    ),
                }
            }
            return { selectedMenus: prevSelectedMenus }; 
        }),
    setSelectAllMenus: (menus) => set(() => ({ selectedMenus: menus })),
    resetMenuListStore: () => set(initialMenuState),
}))