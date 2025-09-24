// src/configs/navigation/userManagement.navigation.config.js

import {
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'

const userManagementNavigationConfig = [
    {
        key: 'userManagement',
        path: '',
        title: 'Users & Roles',
        translateKey: 'nav.userManagement.users',
        icon: 'users',
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: ['admin'], 
        subMenu: [
            {
                key: 'userManagement.list',
                path: '/admin/users',
                title: 'Manage Users',
                translateKey: 'nav.userManagement.list',
                icon: 'user', 
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['admin'],
                subMenu: [],
            },
        ],
    },
]

export default userManagementNavigationConfig