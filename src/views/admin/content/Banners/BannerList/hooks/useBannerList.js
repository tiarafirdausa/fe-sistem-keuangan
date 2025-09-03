import { apiGetAllBanners } from "@/services/BannerService"; // Pastikan Anda mengimpor service yang benar
import useSWR from "swr";
import { useBannerListStore } from "../store/bannerListStore";

const useBannerList = () => {
  const {
    bannerTableData,
    bannerFilterData,
    setBannerTableData,
    setBannerFilterData,
    selectedBanners,
    setSelectedBanners,
    setSelectAllBanners,
  } = useBannerListStore((state) => state);

  const { data, error, isLoading, mutate } = useSWR(
    ["/api/banners", { ...bannerTableData, ...bannerFilterData }],
    // eslint-disable-next-line no-unused-vars
    async ([_, params]) => {
      const response = await apiGetAllBanners(params);
      return response;
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: true,
    }
  );

  const bannerList = data?.data || [];
  const bannerListTotal = data?.pagination?.totalItems || 0;

  return {
    error,
    isLoading,
    bannerTableData,
    bannerFilterData,
    mutate,
    bannerList,
    bannerListTotal,
    setBannerTableData,
    selectedBanners,
    setSelectedBanners,
    setSelectAllBanners,
    setBannerFilterData,
  };
};

export default useBannerList;