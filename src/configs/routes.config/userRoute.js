import { lazy } from 'react'
import { ADMIN_PREFIX_PATH } from '@/constants/route.constant'
import { ADMIN } from '@/constants/roles.constant'

const userRoute = [
    {
        key: 'userManagement.list',
        path: `${ADMIN_PREFIX_PATH}/users`,
        component: lazy(() => import('@/views/admin/users/UserList')),
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
        },
    },
    // {
    //     key: 'userManagement.newUser',
    //     path: `${ADMIN_PREFIX_PATH}/users/new`,
    //     component: lazy(() => import('@/views/content/Users/UserForm')), // Asumsi Anda akan membuat UserForm untuk pembuatan/pengeditan
    //     authority: [ADMIN],
    //     meta: {
    //         pageContainerType: 'contained',
    //         header: {
    //             contained: true,
    //             title: 'Create New User',
    //         },
    //     },
    // },
    // {
    //     key: 'userManagement.editUser',
    //     path: `${ADMIN_PREFIX_PATH}/users/edit/:id`, // Menggunakan :id karena kita menggunakan ID untuk edit
    //     component: lazy(() => import('@/views/content/Users/UserForm')), // UserForm bisa digunakan untuk edit juga
    //     authority: [ADMIN],
    //     meta: {
    //         pageContainerType: 'contained',
    //         header: {
    //             contained: true,
    //             title: 'Edit User',
    //         },
    //     },
    // },
    // {
    //     key: 'userManagement.userDetail',
    //     path: `${ADMIN_PREFIX_PATH}/users/details/:id`, // Rute untuk melihat detail user
    //     component: lazy(() => import('@/views/content/Users/UserDetail')), // Asumsi Anda akan membuat komponen UserDetail
    //     authority: [ADMIN],
    //     meta: {
    //         pageContainerType: 'contained',
    //         header: {
    //             contained: true,
    //             title: 'User Details',
    //         },
    //     },
    // },
]

export default userRoute