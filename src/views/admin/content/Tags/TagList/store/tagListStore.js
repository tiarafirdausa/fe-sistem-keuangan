// stores/tagListStore.js
import { create } from 'zustand'

export const initialTagTableData = {
    pageIndex: 1,
    pageSize: 10,
    query: '', 
    sort: {
        order: '', 
        key: '',   
    },
}

export const initialTagFilterData = {
    search: '', 
}

const initialTagState = {
    tagTableData: initialTagTableData,
    tagFilterData: initialTagFilterData,
    selectedTags: [], 
}

export const useTagListStore = create((set) => ({
    ...initialTagState,
    setTagFilterData: (payload) => set(() => ({ tagFilterData: payload })),
    setTagTableData: (payload) => set(() => ({ tagTableData: payload })),
    setSelectedTags: (checked, tag) =>
        set((state) => {
            const prevSelectedTags = state.selectedTags
            if (checked) {
                if (!prevSelectedTags.some((prevTag) => tag.id === prevTag.id)) {
                    return { selectedTags: [...prevSelectedTags, tag] }
                }
            } else {
                return {
                    selectedTags: prevSelectedTags.filter(
                        (prevTag) => prevTag.id !== tag.id,
                    ),
                }
            }
            return { selectedTags: prevSelectedTags }; 
        }),
    setSelectAllTags: (tags) => set(() => ({ selectedTags: tags })),
    resetTagListStore: () => set(initialTagState), 
}))