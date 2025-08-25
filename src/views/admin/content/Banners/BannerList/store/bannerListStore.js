import { create } from "zustand";

export const initialBannerTableData = {
  pageIndex: 1,
  pageSize: 10,
  query: "",
  sort: {
    order: "",
    key: "",
  },
};

export const initialBannerFilterData = {
  search: "",
};

const initialBannerState = {
  bannerTableData: initialBannerTableData,
  bannerFilterData: initialBannerFilterData,
  selectedBanners: [],
};

export const useBannerListStore = create((set) => ({
  ...initialBannerState,
  setBannerFilterData: (payload) => set(() => ({ bannerFilterData: payload })),
  setBannerTableData: (payload) => set(() => ({ bannerTableData: payload })),
  setSelectedBanners: (checked, banner) =>
    set((state) => {
      const prevSelectedBanners = state.selectedBanners;
      if (checked) {
        if (!prevSelectedBanners.some((prevBanner) => banner.id === prevBanner.id)) {
          return { selectedBanners: [...prevSelectedBanners, banner] };
        }
      } else {
        return {
          selectedBanners: prevSelectedBanners.filter(
            (prevBanner) => prevBanner.id !== banner.id
          ),
        };
      }
      return { selectedBanners: prevSelectedBanners };
    }),
  setSelectAllBanners: (banners) => set(() => ({ selectedBanners: banners })),
  resetBannerListStore: () => set(initialBannerState),
}));