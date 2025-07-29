// src/views/content/Users/UserList/hooks/useUserList.js
import { apiGetAllUsers } from '@/services/UserService';
import useSWR from 'swr';
import { useUserListStore } from '../store/UserListStore';

const useUserList = () => {
    const {
        userTableData,
        userFilterData,
        setUserTableData,
        setUserFilterData,
        selectedUsers,
        setSelectedUsers,
        setSelectAllUsers,
    } = useUserListStore((state) => state);

    const { data, error, isLoading, mutate } = useSWR(
        ['/api/users', { ...userTableData, ...userFilterData }],
        // eslint-disable-next-line no-unused-vars
        async ([_, params]) => {
            const response = await apiGetAllUsers(params);
            return response; 
        },
        {
            revalidateOnFocus: false,
            revalidateIfStale: true,
        },
    );

    const userList = data?.users || [];
    const userListTotal = data?.totalCount || 0;

    return {
        error,         
        isLoading,     
        userTableData,
        userFilterData,
        mutate,
        userList,      
        userListTotal, 
        setUserTableData,
        setUserFilterData,
        selectedUsers,
        setSelectedUsers,
        setSelectAllUsers,
    };
};

export default useUserList;