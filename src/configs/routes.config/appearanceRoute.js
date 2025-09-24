import { lazy } from 'react'
import { ADMIN_PREFIX_PATH } from '@/constants/route.constant'
import { ADMIN} from '@/constants/roles.constant'

const appearanceRoute = [
    {
        key: 'appearance.moduls',
        path: `${ADMIN_PREFIX_PATH}/moduls`,
        component: lazy(() => import('@/views/admin/appearance/Moduls/ModulList')),
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'appearance.moduls.new',
        path: `${ADMIN_PREFIX_PATH}/moduls/new`,
        component: lazy(() => import('@/views/admin/appearance/Moduls/ModulCreate')),
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: 'Create New Modul',
            },
        },
    },
    {
        key: 'appearance.moduls.edit',
        path: `${ADMIN_PREFIX_PATH}/moduls/edit/:id`,
        component: lazy(() => import('@/views/admin/appearance/Moduls/ModulEdit')),
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: 'Edit Modul',
            },
        },
    },
    {
        key: 'appearance.settings',
        path: `${ADMIN_PREFIX_PATH}/settings`,
        component: lazy(() => import('@/views/admin/appearance/Settings')),
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: 'General Settings',
            },
        },
    },
     {
        key: 'appearance.theme',
        path: `${ADMIN_PREFIX_PATH}/theme`,
        component: lazy(() => import('@/views/admin/appearance/Theme')), 
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
            },
        },
    },
]

export default appearanceRoute;