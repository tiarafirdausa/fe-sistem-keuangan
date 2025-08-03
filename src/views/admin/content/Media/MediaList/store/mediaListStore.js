import { create } from 'zustand'

export const initialMediaTableData = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
        order: '',
        key: '',
    },
}

export const initialMediaFilterData = {
    search: '',
    categoryId: '',
    type: '',
    uploadedBy: '',
}

const initialMediaState = {
    mediaTableData: initialMediaTableData,
    mediaFilterData: initialMediaFilterData,
    selectedMedia: [],
}

export const useMediaListStore = create((set) => ({
    ...initialMediaState,
    setMediaFilterData: (payload) => set(() => ({ mediaFilterData: payload })),
    setMediaTableData: (payload) => set(() => ({ mediaTableData: payload })),
    setSelectedMedia: (checked, media) =>
        set((state) => {
            const prevSelectedMedia = state.selectedMedia
            if (checked) {
                if (!prevSelectedMedia.some((prevMedia) => media.id === prevMedia.id)) {
                    return { selectedMedia: [...prevSelectedMedia, media] }
                }
            } else {
                return {
                    selectedMedia: prevSelectedMedia.filter(
                        (prevMedia) => prevMedia.id !== media.id,
                    ),
                }
            }
            return { selectedMedia: prevSelectedMedia };
        }),
    setSelectAllMedia: (mediaList) => set(() => ({ selectedMedia: mediaList })),
    resetMediaListStore: () => set(initialMediaState),
}))