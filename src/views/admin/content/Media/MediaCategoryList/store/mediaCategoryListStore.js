import { create } from 'zustand'

export const initialMediaCategoryTableData = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
        order: '',
        key: '',
    },
}

export const initialMediaCategoryFilterData = {
    search: '',
}

const initialMediaCategoryState = {
    mediaCategoryTableData: initialMediaCategoryTableData,
    mediaCategoryFilterData: initialMediaCategoryFilterData,
    selectedMediaCategories: [],
}

export const useMediaCategoryListStore = create((set) => ({
    ...initialMediaCategoryState,
    setMediaCategoryFilterData: (payload) => set(() => ({ mediaCategoryFilterData: payload })),
    setMediaCategoryTableData: (payload) => set(() => ({ mediaCategoryTableData: payload })),
    setSelectedMediaCategories: (checked, category) =>
        set((state) => {
            const prevSelectedCategories = state.selectedMediaCategories
            if (checked) {
                if (!prevSelectedCategories.some((prevCategory) => category.id === prevCategory.id)) {
                    return { selectedMediaCategories: [...prevSelectedCategories, category] }
                }
            } else {
                return {
                    selectedMediaCategories: prevSelectedCategories.filter(
                        (prevCategory) => prevCategory.id !== category.id,
                    ),
                }
            }
            return { selectedMediaCategories: prevSelectedCategories };
        }),
    setSelectAllMediaCategories: (categories) => set(() => ({ selectedMediaCategories: categories })),
    resetMediaCategoryListStore: () => set(initialMediaCategoryState),
}))