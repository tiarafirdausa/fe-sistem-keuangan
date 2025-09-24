// src/configs/navigation.config/dashboard.navigation.config.js

import { NAV_ITEM_TYPE_ITEM } from '@/constants/navigation.constant'

const dashboardNavigationConfig = [
    {
        key: 'dashboard',
        path: '/dashboard',
        title: 'Dashboard',
        translateKey: 'nav.dashboard',
        icon: 'dashboard', 
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['admin', 'editor', 'author'],
        subMenu: [],
    },
]

export default dashboardNavigationConfig