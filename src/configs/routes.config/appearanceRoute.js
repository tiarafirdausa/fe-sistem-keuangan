import { lazy } from 'react'
import { ADMIN_PREFIX_PATH } from '@/constants/route.constant'
import { ADMIN } from '@/constants/roles.constant'

const appearanceRoute = [
    {
        key: 'appearance.menus.items',
        path: `${ADMIN_PREFIX_PATH}/menus/:menuId/items`,
        component: lazy(() => import('@/views/admin/appearance/Menus/MenuItem/MenuItemList')),
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'appearance.menus.items.new',
        path: `${ADMIN_PREFIX_PATH}/menus/:menuId/items/new`,
        component: lazy(() => import('@/views/admin/appearance/Menus/MenuItem/MenuItemCreate')),
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: 'Create New Menu Item',
            },
        },
    },
    {
        key: 'appearance.menus.items.edit',
        path: `${ADMIN_PREFIX_PATH}/menus/:menuId/items/edit/:id`,
        component: lazy(() => import('@/views/admin/appearance/Menus/MenuItem/MenuItemEdit')),
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: 'Edit Menu Item',
            },
        },
    },
    {
        key: 'appearance.menus',
        path: `${ADMIN_PREFIX_PATH}/menus`,
        component: lazy(() => import('@/views/admin/appearance/Menus/MenuList')),
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'appearance.menus.new',
        path: `${ADMIN_PREFIX_PATH}/menus/new`,
        component: lazy(() => import('@/views/admin/appearance/Menus/MenuCreate')),
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: 'Create New Menu',
            },
        },
    },
    {
        key: 'appearance.menus.edit',
        path: `${ADMIN_PREFIX_PATH}/menus/edit/:id`,
        component: lazy(() => import('@/views/admin/appearance/Menus/MenuEdit')),
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: 'Edit Menu',
            },
        },
    },

    {
        key: 'appearance.socialLinks',
        path: `${ADMIN_PREFIX_PATH}/social-links`,
        component: lazy(() => import('@/views/admin/appearance/SocialLinks/SocialLinkList')),
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'appearance.socialLinks.new',
        path: `${ADMIN_PREFIX_PATH}/social-links/new`,
        component: lazy(() => import('@/views/admin/appearance/SocialLinks/SocialLinkCreate')),
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: 'Create New Social Link',
            },
        },
    },
    {
        key: 'appearance.socialLinks.edit',
        path: `${ADMIN_PREFIX_PATH}/social-links/edit/:id`,
        component: lazy(() => import('@/views/admin/appearance/SocialLinks/SocialLinkEdit')),
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: 'Edit Social Link',
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
]

export default appearanceRoute;