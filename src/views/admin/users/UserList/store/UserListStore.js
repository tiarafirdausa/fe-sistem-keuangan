// src/views/content/Users/UserList/store/UserListStore.js
import { create } from 'zustand'

export const initialUserTableData = {
    pageIndex: 1,
    pageSize: 10,
    query: '', 
    sort: {
        order: '',
        key: '',
    },
}

export const initialUserFilterData = {
    search: '',
    role: '',  
    status: '',
}

const initialUserState = {
    userTableData: initialUserTableData,
    userFilterData: initialUserFilterData,
    selectedUsers: [],
    
}

export const useUserListStore = create((set) => ({
    ...initialUserState,
    setUserFilterData: (payload) => set(() => ({ userFilterData: payload })),
    setUserTableData: (payload) => set(() => ({ userTableData: payload })),
    setSelectedUsers: (checked, user) =>
        set((state) => {
            const prevSelectedUsers = state.selectedUsers
            if (checked) {
                if (!prevSelectedUsers.some((prevUser) => user.id === prevUser.id)) {
                    return { selectedUsers: [...prevSelectedUsers, user] }
                }
            } else {
                return {
                    selectedUsers: prevSelectedUsers.filter(
                        (prevUser) => prevUser.id !== user.id,
                    ),
                }
            }
            return { selectedUsers: prevSelectedUsers };
        }),
    setSelectAllUsers: (users) => set(() => ({ selectedUsers: users })),
    resetUserListStore: () => set(initialUserState),
}))