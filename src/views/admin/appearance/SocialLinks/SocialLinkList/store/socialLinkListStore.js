// src/stores/socialLinkListStore.js
import { create } from 'zustand'

export const initialSocialLinkTableData = {
    pageIndex: 1,
    pageSize: 10,
    query: '', 
    sort: {
        order: '',
        key: '',
    },
}

export const initialSocialLinkFilterData = {

}

const initialSocialLinkState = {
    socialLinkTableData: initialSocialLinkTableData,
    socialLinkFilterData: initialSocialLinkFilterData,
    selectedSocialLinks: [], 
}

export const useSocialLinkListStore = create((set) => ({
    ...initialSocialLinkState,
    setSocialLinkFilterData: (payload) => set(() => ({ socialLinkFilterData: payload })),
    setSocialLinkTableData: (payload) => set(() => ({ socialLinkTableData: payload })),
    setSelectedSocialLinks: (checked, socialLink) =>
        set((state) => {
            const prevSelectedSocialLinks = state.selectedSocialLinks
            if (checked) {
                if (!prevSelectedSocialLinks.some((prevLink) => socialLink.id === prevLink.id)) {
                    return { selectedSocialLinks: [...prevSelectedSocialLinks, socialLink] }
                }
            } else {
                return {
                    selectedSocialLinks: prevSelectedSocialLinks.filter(
                        (prevLink) => prevLink.id !== socialLink.id,
                    ),
                }
            }
            return { selectedSocialLinks: prevSelectedSocialLinks }; 
        }),
    setSelectAllSocialLinks: (socialLinks) => set(() => ({ selectedSocialLinks: socialLinks })),
    resetSocialLinkListStore: () => set(initialSocialLinkState),
}))