// src/configs/routes.config/appearanceRoute.js

import { lazy } from 'react'
import { ADMIN_PREFIX_PATH } from '@/constants/route.constant'
import { ADMIN } from '@/constants/roles.constant'

const appearanceRoute = [
    {
        key: 'appearance.menus',
        path: `${ADMIN_PREFIX_PATH}/menus`,
        component: lazy(() => import('@/views/admin/appearance/Menus')), 
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'appearance.socialLinks',
        path: `${ADMIN_PREFIX_PATH}/social-links`,
        component: lazy(() => import('@/views/admin/appearance/SocialLinks')), 
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'appearance.settings',
        path: `${ADMIN_PREFIX_PATH}/settings`,
        component: lazy(() => import('@/views/admin/appearance/Settings')), 
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
        },
    },
]

export default appearanceRoute