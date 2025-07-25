// src/stores/socialLinkListStore.js
import { create } from 'zustand'

export const initialSocialLinkTableData = {
    pageIndex: 1,
    pageSize: 10,
    query: '', // Untuk search input
    sort: {
        order: '',
        key: '',
    },
}

export const initialSocialLinkFilterData = {
    // Jika ada filter tambahan selain 'query' dari tableData, tambahkan di sini.
    // Contoh: type: '', status: ''
}

const initialSocialLinkState = {
    socialLinkTableData: initialSocialLinkTableData,
    socialLinkFilterData: initialSocialLinkFilterData,
    selectedSocialLinks: [], // Untuk multi-selection di tabel
}

export const useSocialLinkListStore = create((set) => ({
    ...initialSocialLinkState,
    setSocialLinkFilterData: (payload) => set(() => ({ socialLinkFilterData: payload })),
    setSocialLinkTableData: (payload) => set(() => ({ socialLinkTableData: payload })),
    setSelectedSocialLinks: (checked, socialLink) =>
        set((state) => {
            const prevSelectedSocialLinks = state.selectedSocialLinks
            if (checked) {
                // Tambahkan jika belum ada
                if (!prevSelectedSocialLinks.some((prevLink) => socialLink.id === prevLink.id)) {
                    return { selectedSocialLinks: [...prevSelectedSocialLinks, socialLink] }
                }
            } else {
                // Hapus jika ada
                return {
                    selectedSocialLinks: prevSelectedSocialLinks.filter(
                        (prevLink) => prevLink.id !== socialLink.id,
                    ),
                }
            }
            return { selectedSocialLinks: prevSelectedSocialLinks }; // Jika tidak ada perubahan
        }),
    setSelectAllSocialLinks: (socialLinks) => set(() => ({ selectedSocialLinks: socialLinks })),
    resetSocialLinkListStore: () => set(initialSocialLinkState),
}))