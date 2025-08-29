import { create } from 'zustand';

export const initialLinkTableData = {
    pageIndex: 1,
    pageSize: 10,
    query: '',
    sort: {
        order: '',
        key: '',
    },
};

export const initialLinkFilterData = {
    search: '',
};

const initialLinkState = {
    linkTableData: initialLinkTableData,
    linkFilterData: initialLinkFilterData,
    selectedLinks: [],
};

export const useLinkListStore = create((set) => ({
    ...initialLinkState,
    setLinkFilterData: (payload) => set(() => ({ linkFilterData: payload })),
    setLinkTableData: (payload) => set(() => ({ linkTableData: payload })),
    setSelectedLinks: (checked, link) =>
        set((state) => {
            const prevSelectedLinks = state.selectedLinks;
            if (checked) {
                if (!prevSelectedLinks.some((prevLink) => link.id === prevLink.id)) {
                    return { selectedLinks: [...prevSelectedLinks, link] };
                }
            } else {
                return {
                    selectedLinks: prevSelectedLinks.filter(
                        (prevLink) => prevLink.id !== link.id,
                    ),
                };
            }
            return { selectedLinks: prevSelectedLinks };
        }),
    setSelectAllLinks: (links) => set(() => ({ selectedLinks: links })),
    resetLinkListStore: () => set(initialLinkState),
}));