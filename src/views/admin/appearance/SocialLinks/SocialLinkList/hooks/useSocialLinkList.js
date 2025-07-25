// src/hooks/useSocialLinkList.js
import { useCallback, useEffect } from 'react';
import { apiGetAllSocialLinks } from '@/services/SocialLinkService';
import useSWR from 'swr';
import { useSocialLinkListStore } from '../store/socialLinkListStore';
import cloneDeep from 'lodash/cloneDeep';

const useSocialLinkList = () => {
    const {
        socialLinkTableData,
        socialLinkFilterData,
        setSocialLinkTableData,
        setSocialLinkFilterData, // Untuk filter tambahan jika ada
        selectedSocialLinks,
        setSelectedSocialLinks,
        setSelectAllSocialLinks,
    } = useSocialLinkListStore((state) => state);

    // Gabungkan data tabel dan filter untuk parameter API
    const queryParams = {
        pageIndex: socialLinkTableData.pageIndex,
        pageSize: socialLinkTableData.pageSize,
        query: socialLinkTableData.query, // Untuk pencarian 'platform'
        sort: socialLinkTableData.sort,
        ...socialLinkFilterData, // Gabungkan filter tambahan
    };

    // Fungsi fetcher untuk SWR
    const fetcher = useCallback(async (params) => {
        const response = await apiGetAllSocialLinks(params);
        // Respons backend diharapkan { data: [], total: 0, pageIndex: 1, pageSize: 10 }
        return response;
    }, []);

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/socials', queryParams], // Key SWR, berubah saat queryParams berubah
        () => fetcher(queryParams),
        {
            revalidateOnFocus: false,
            revalidateIfStale: true,
            onError: (err) => {
                console.error("Error fetching social links:", err);
                // Contoh: toast.push(<Notification type="danger" title="Error fetching social links" />);
            }
        },
    );

    const socialLinkList = data?.data || []; // Data sebenarnya ada di 'data.data' dari respons backend
    const socialLinkListTotal = data?.total || 0; // Total data ada di 'data.total' dari respons backend

    // Helper untuk memperbarui socialLinkTableData dengan aman
    const handleSetTableData = useCallback((newData) => {
        setSocialLinkTableData(newData);
        // Opsional: Hapus pilihan saat data tabel berubah (misalnya, ganti halaman)
        if (selectedSocialLinks.length > 0) {
            setSelectAllSocialLinks([]);
        }
    }, [setSocialLinkTableData, selectedSocialLinks, setSelectAllSocialLinks]);

    const onPaginationChange = useCallback((page) => {
        const newTableData = cloneDeep(socialLinkTableData);
        newTableData.pageIndex = page;
        handleSetTableData(newTableData);
    }, [socialLinkTableData, handleSetTableData]);

    const onPageSizeChange = useCallback((size) => {
        const newTableData = cloneDeep(socialLinkTableData);
        newTableData.pageSize = Number(size);
        newTableData.pageIndex = 1; // Reset ke halaman pertama saat ukuran halaman berubah
        handleSetTableData(newTableData);
    }, [socialLinkTableData, handleSetTableData]);

    const onSort = useCallback((order, key) => {
        const newTableData = cloneDeep(socialLinkTableData);
        newTableData.sort = { order, key };
        handleSetTableData(newTableData);
    }, [socialLinkTableData, handleSetTableData]);

    const onSearch = useCallback((queryValue) => {
        const newTableData = cloneDeep(socialLinkTableData);
        newTableData.query = queryValue;
        newTableData.pageIndex = 1; // Reset ke halaman pertama saat melakukan pencarian
        handleSetTableData(newTableData);
    }, [socialLinkTableData, handleSetTableData]);

    // Opsional: efek samping untuk penanganan error
    useEffect(() => {
        if (error) {
            // console.error("Error in useSocialLinkList hook:", error);
            // Tambahkan logika untuk menampilkan toast atau notifikasi error di sini
        }
    }, [error]);

    return {
        error,
        isLoading,
        socialLinkTableData,
        socialLinkFilterData,
        mutate, // Untuk memuat ulang data secara manual
        socialLinkList,
        socialLinkListTotal,
        setSocialLinkTableData,
        selectedSocialLinks,
        setSelectedSocialLinks,
        setSelectAllSocialLinks,
        setSocialLinkFilterData,
        // Fungsi-fungsi untuk event handler DataTable
        onPaginationChange,
        onPageSizeChange,
        onSort,
        onSearch,
    };
};

export default useSocialLinkList;