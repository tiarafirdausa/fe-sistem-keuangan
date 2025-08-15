// stores/pageListStore.js
import { create } from 'zustand';

export const initialPageTableData = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
        order: '',
        key: '',
    },
};

export const initialPageFilterData = {
    search: '',
    author_id: '',
};

const initialPageState = {
    pageTableData: initialPageTableData,
    pageFilterData: initialPageFilterData,
    selectedPages: [],
};

export const usePageListStore = create((set) => ({
    ...initialPageState,
    setPageFilterData: (payload) => set(() => ({ pageFilterData: payload })),
    setPageTableData: (payload) => set(() => ({ pageTableData: payload })),
    setSelectedPages: (checked, page) =>
        set((state) => {
            const prevSelectedPages = state.selectedPages;
            if (checked) {
                if (!prevSelectedPages.some((prevPage) => page.id === prevPage.id)) {
                    return { selectedPages: [...prevSelectedPages, page] };
                }
            } else {
                return {
                    selectedPages: prevSelectedPages.filter(
                        (prevPage) => prevPage.id !== page.id,
                    ),
                };
            }
            return { selectedPages: prevSelectedPages };
        }),

    setSelectAllPages: (pages) => set(() => ({ selectedPages: pages })),
    resetPageListStore: () => set(initialPageState),
}));