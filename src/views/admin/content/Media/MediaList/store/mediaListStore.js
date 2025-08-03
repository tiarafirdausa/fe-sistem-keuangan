import { create } from 'zustand';

export const initialMediaTableData = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
        order: '',
        key: '',
    },
};

export const initialMediaFilterData = {
    search: '',
    categoryId: '',
    authorId: '',
};

const initialMediaState = {
    mediaTableData: initialMediaTableData,
    mediaFilterData: initialMediaFilterData,
    selectedMediaCollections: [],
};

export const useMediaListStore = create((set) => ({
    ...initialMediaState,
    setMediaFilterData: (payload) => set(() => ({ mediaFilterData: payload })),
    setMediaTableData: (payload) => set(() => ({ mediaTableData: payload })),
    setSelectedMediaCollections: (checked, collection) =>
        set((state) => {
            const prevSelectedCollections = state.selectedMediaCollections;
            if (checked) {
                if (!prevSelectedCollections.some((prevCol) => collection.id === prevCol.id)) {
                    return { selectedMediaCollections: [...prevSelectedCollections, collection] };
                }
            } else {
                return {
                    selectedMediaCollections: prevSelectedCollections.filter(
                        (prevCol) => prevCol.id !== collection.id,
                    ),
                };
            }
            return { selectedMediaCollections: prevSelectedCollections };
        }),

    setSelectAllMediaCollections: (collections) => set(() => ({ selectedMediaCollections: collections })),
    resetMediaListStore: () => set(initialMediaState),
}));