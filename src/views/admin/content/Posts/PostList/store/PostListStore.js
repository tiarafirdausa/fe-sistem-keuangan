import { create } from 'zustand'

export const initialTableData = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
        order: '',
        key: '',
    },
}

export const initialFilterData = {
    authorId: null,      
    categoryId: null,    
    tagId: null,         
    status: 'published', 
}

const initialState = {
    tableData: initialTableData,
    filterData: initialFilterData,
    selectedPost: [], 
}

export const usePostListStore = create((set) => ({
    ...initialState,
    setFilterData: (payload) => set(() => ({ filterData: payload })),
    setTableData: (payload) => set(() => ({ tableData: payload })),
    setSelectedPost: (checked, row) =>
        set((state) => {
            const prevData = state.selectedPost
            if (checked) {
                return { selectedPost: [...prevData, row] }
            } else {
                return {
                    selectedPost: prevData.filter(
                        (prevPost) => prevPost.id !== row.id,
                    ),
                }
            }
        }),
        setSelectAllPost: (payload) => set(() => ({ selectedPost: payload })),
}));