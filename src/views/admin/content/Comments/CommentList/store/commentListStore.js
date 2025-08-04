// stores/commentListStore.js
import { create } from 'zustand';

export const initialCommentTableData = {
    pageIndex: 1,
    pageSize: 10,
    query: '', 
    sort: {
        order: '', 
        key: '',   
    },
};

export const initialCommentFilterData = {
    search: '',   
    status: '',   
    postId: '',   
};

const initialCommentState = {
    commentTableData: initialCommentTableData,
    commentFilterData: initialCommentFilterData,
    selectedComments: [], 
};

export const useCommentListStore = create((set) => ({
    ...initialCommentState,

    setCommentFilterData: (payload) => set(() => ({ commentFilterData: payload })),
    setCommentTableData: (payload) => set(() => ({ commentTableData: payload })),
    setSelectedComments: (checked, comment) =>
        set((state) => {
            const prevSelectedComments = state.selectedComments;
            if (checked) {
                if (!prevSelectedComments.some((prevComment) => comment.id === prevComment.id)) {
                    return { selectedComments: [...prevSelectedComments, comment] };
                }
            } else {
                return {
                    selectedComments: prevSelectedComments.filter(
                        (prevComment) => prevComment.id !== comment.id,
                    ),
                };
            }
            return { selectedComments: prevSelectedComments };
        }),

    setSelectAllComments: (comments) => set(() => ({ selectedComments: comments })),
    resetCommentListStore: () => set(initialCommentState),
}));
