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
                key: 'appearance.moduls',
                path: '/admin/moduls',
                title: 'Modul',
                translateKey: 'nav.appearance.moduls',
                icon: 'modul',
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