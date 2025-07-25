// stores/categoryListStore.js
import { create } from 'zustand'

export const initialCategoryTableData = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
        order: '',
        key: '',
    },
}

export const initialCategoryFilterData = {
    search: '',
}

const initialCategoryState = {
    categoryTableData: initialCategoryTableData,
    categoryFilterData: initialCategoryFilterData,
    selectedCategories: [],
}

export const useCategoryListStore = create((set) => ({
    ...initialCategoryState,
    setCategoryFilterData: (payload) => set(() => ({ categoryFilterData: payload })),
    setCategoryTableData: (payload) => set(() => ({ categoryTableData: payload })),
    setSelectedCategories: (checked, category) =>
        set((state) => {
            const prevSelectedCategories = state.selectedCategories
            if (checked) {
                if (!prevSelectedCategories.some((prevCategory) => category.id === prevCategory.id)) {
                    return { selectedCategories: [...prevSelectedCategories, category] }
                }
            } else {
                return {
                    selectedCategories: prevSelectedCategories.filter(
                        (prevCategory) => prevCategory.id !== category.id,
                    ),
                }
            }
            return { selectedCategories: prevSelectedCategories };
        }),
    setSelectAllCategories: (categories) => set(() => ({ selectedCategories: categories })),
    resetCategoryListStore: () => set(initialCategoryState),
}))