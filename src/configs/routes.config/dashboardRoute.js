// src/configs/routes.config/dashboardRoute.js

import { lazy } from 'react'
import { DASHBOARDS_PREFIX_PATH } from '@/constants/route.constant'
import { ADMIN, USER } from '@/constants/roles.constant' 

const dashboardRoute = [
    {
        key: 'dashboard',
        path: `${DASHBOARDS_PREFIX_PATH}`,
        component: lazy(() => import('@/views/admin/Dashboard')), 
        authority: [ADMIN, USER], 
        meta: {
            pageContainerType: 'contained',
        },
    },
]

export default dashboardRoute