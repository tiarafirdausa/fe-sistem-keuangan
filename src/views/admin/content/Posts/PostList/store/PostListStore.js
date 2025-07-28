// stores/postListStore.js
import { create } from 'zustand'

export const initialPostTableData = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
        order: '',
        key: '',  
    },
}

export const initialPostFilterData = {
    search: '',     
    categoryId: '', 
    tagId: '',      
    status: '',     
    authorId: '',   
}

const initialPostState = {
    postTableData: initialPostTableData,
    postFilterData: initialPostFilterData,
    selectedPosts: [],
}

export const usePostListStore = create((set) => ({
    ...initialPostState,
    setPostFilterData: (payload) => set(() => ({ postFilterData: payload })),
    setPostTableData: (payload) => set(() => ({ postTableData: payload })),
    setSelectedPosts: (checked, post) =>
        set((state) => {
            const prevSelectedPosts = state.selectedPosts
            if (checked) {
                if (!prevSelectedPosts.some((prevPost) => post.id === prevPost.id)) {
                    return { selectedPosts: [...prevSelectedPosts, post] }
                }
            } else {
                return {
                    selectedPosts: prevSelectedPosts.filter(
                        (prevPost) => prevPost.id !== post.id,
                    ),
                }
            }
            return { selectedPosts: prevSelectedPosts }; 
        }),

    setSelectAllPosts: (posts) => set(() => ({ selectedPosts: posts })),
    resetPostListStore: () => set(initialPostState),
}))