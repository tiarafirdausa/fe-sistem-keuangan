// src/configs/navigation.config.js

import {
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'

const navigationConfig = [
    {
        key: 'dashboard',
        path: '/dashboard',
        title: 'Dashboard',
        translateKey: 'nav.dashboard',
        icon: 'dashboard', 
        type: NAV_ITEM_TYPE_ITEM,
        authority: ['admin', 'editor'], 
        subMenu: [],
    },
    {
        key: 'contentManagement',
        path: '', // Path kosong karena ini adalah menu Collapse/Grup
        title: 'Content Management',
        translateKey: 'nav.contentManagement.content',
        icon: 'content', // Icon untuk kategori "Content"
        type: NAV_ITEM_TYPE_COLLAPSE, // Ini adalah menu yang bisa dilipat
        authority: ['admin', 'editor'],
        subMenu: [
            {
                key: 'contentManagement.posts',
                path: '/admin/posts',
                title: 'Posts',
                translateKey: 'nav.contentManagement.posts',
                icon: 'post', // Icon untuk Posts
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['admin', 'editor'],
                subMenu: [],
            },
            {
                key: 'contentManagement.pages',
                path: '/admin/pages',
                title: 'Pages',
                translateKey: 'nav.contentManagement.pages',
                icon: 'page', // Icon untuk Pages
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['admin', 'editor'],
                subMenu: [],
            },
            {
                key: 'contentManagement.categories',
                path: '/admin/categories',
                title: 'Categories',
                translateKey: 'nav.contentManagement.categories',
                icon: 'category', // Icon untuk Categories
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['admin', 'editor'],
                subMenu: [],
            },
            {
                key: 'contentManagement.tags',
                path: '/admin/tags',
                title: 'Tags',
                translateKey: 'nav.contentManagement.tags',
                icon: 'tag', // Icon untuk Tags
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['admin', 'editor'],
                subMenu: [],
            },
            {
                key: 'contentManagement.comments',
                path: '/admin/comments',
                title: 'Comments',
                translateKey: 'nav.contentManagement.comments',
                icon: 'comment', // Icon untuk Comments
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['admin', 'editor'],
                subMenu: [],
            },
            {
                key: 'contentManagement.media',
                path: '/admin/media',
                title: 'Media',
                translateKey: 'nav.contentManagement.media',
                icon: 'media', // Icon untuk Media
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['admin', 'editor'],
                subMenu: [],
            },
        ],
    },
    {
        key: 'userManagement',
        path: '',
        title: 'Users & Roles',
        translateKey: 'nav.userManagement.users',
        icon: 'users', // Icon untuk Users & Roles
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: ['admin'], // Hanya admin yang bisa mengelola pengguna dan peran
        subMenu: [
            {
                key: 'userManagement.list',
                path: '/admin/users',
                title: 'Manage Users',
                translateKey: 'nav.userManagement.list',
                icon: 'user', // Icon untuk Manage Users
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['admin'],
                subMenu: [],
            },
            // Anda bisa menambahkan ini nanti jika ada fitur manajemen peran terpisah
            // {
            //     key: 'userManagement.roles',
            //     path: '/admin/roles',
            //     title: 'Roles & Permissions',
            //     translateKey: 'nav.userManagement.roles',
            //     icon: 'role',
            //     type: NAV_ITEM_TYPE_ITEM,
            //     authority: ['admin'],
            //     subMenu: [],
            // },
        ],
    },
    {
        key: 'appearance',
        path: '',
        title: 'Appearance',
        translateKey: 'nav.appearance.appearance',
        icon: 'appearance', // Icon untuk Appearance
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: ['admin'], // Biasanya hanya admin
        subMenu: [
            {
                key: 'appearance.menus',
                path: '/admin/menus',
                title: 'Menus',
                translateKey: 'nav.appearance.menus',
                icon: 'menu', // Icon untuk Menus
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['admin'],
                subMenu: [],
            },
            {
                key: 'appearance.socialLinks',
                path: '/admin/social-links',
                title: 'Social Links',
                translateKey: 'nav.appearance.socialLinks',
                icon: 'social', // Icon untuk Social Links
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['admin'],
                subMenu: [],
            },
            {
                key: 'appearance.settings',
                path: '/admin/settings',
                title: 'Settings',
                translateKey: 'nav.appearance.settings',
                icon: 'settings', // Icon untuk Settings
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['admin'],
                subMenu: [],
            },
        ],
    },
    // Anda bisa menambahkan item navigasi lain di sini jika diperlukan,
    // seperti Analytics, Reports, dll.
]

export default navigationConfig