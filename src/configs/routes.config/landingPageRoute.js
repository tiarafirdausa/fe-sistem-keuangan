// src/configs/routes.config/landingPageRoute.js
import { lazy } from 'react'
import { LAYOUT_BLANK } from '@/constants/theme.constant'

const landingPageRoute = [
    {
        key: 'landingPage',
        path: '/', 
        component: lazy(() => import('@/views/Landing')),
        authority: [], 
        meta: {
            layout: LAYOUT_BLANK, 
            pageContainerType: 'contained',
        },
    },
]

export default landingPageRoute
