import { apiGetAllLinks } from '@/services/LinkService';
import useSWR from 'swr';
import { useLinkListStore } from '../store/linkListStore';

const useLinkList = () => {
    const {
        linkTableData,
        linkFilterData,
        setLinkTableData,
        setLinkFilterData,
        selectedLinks,
        setSelectedLinks,
        setSelectAllLinks,
    } = useLinkListStore((state) => state);

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/links', { ...linkTableData, ...linkFilterData }],
        // eslint-disable-next-line no-unused-vars
        async ([_, params]) => {
            const response = await apiGetAllLinks(params);
            return response;
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: true,
        },
    );

    const linkList = data?.data || [];
    const linkListTotal = data?.pagination?.totalItems || 0;

    return {
        error,
        isLoading,
        linkTableData,
        linkFilterData,
        mutate,
        linkList,
        linkListTotal,
        setLinkTableData,
        selectedLinks,
        setSelectedLinks,
        setSelectAllLinks,
        setLinkFilterData,
    };
};

export default useLinkList;