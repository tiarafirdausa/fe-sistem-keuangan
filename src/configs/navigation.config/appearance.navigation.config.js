// src/configs/navigation/appearance.navigation.config.js

import {
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'

const appearanceNavigationConfig = [
    {
        key: 'appearance',
        path: '',
        title: 'Appearance',
        translateKey: 'nav.appearance.appearance',
        icon: 'appearance', 
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: ['admin'], 
        subMenu: [
            {
                key: 'appearance.menus',
                path: '/admin/menus',
                title: 'Menus',
                translateKey: 'nav.appearance.menus',
                icon: 'menu',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['admin'],
                subMenu: [],
            },
            {
                key: 'appearance.socialLinks',
                path: '/admin/social-links',
                title: 'Social Links',
                translateKey: 'nav.appearance.socialLinks',
                icon: 'social', 
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['admin'],
                subMenu: [],
            },
            {
                key: 'appearance.settings',
                path: '/admin/settings',
                title: 'Settings',
                translateKey: 'nav.appearance.settings',
                icon: 'settings', 
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['admin'],
                subMenu: [],
            },
            {
                key: 'appearance.theme',
                path: '/admin/theme',
                title: 'Theme',
                translateKey: 'nav.appearance.theme',
                icon: 'appearance', 
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['admin'],
                subMenu: [],
            },
        ],
    },
]

export default appearanceNavigationConfig