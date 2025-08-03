// src/configs/navigation/contentManagement.navigation.config.js

import {
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE,
} from '@/constants/navigation.constant'

const contentManagementNavigationConfig = [
    {
        key: 'contentManagement',
        path: '', 
        title: 'Content Management',
        translateKey: 'nav.contentManagement.content',
        icon: 'content', 
        type: NAV_ITEM_TYPE_COLLAPSE,
        authority: ['admin', 'editor'],
        subMenu: [
            {
                key: 'contentManagement.posts',
                path: '/admin/posts',
                title: 'Posts',
                translateKey: 'nav.contentManagement.posts',
                icon: 'post',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['admin', 'editor'],
                subMenu: [],
            },
            {
                key: 'contentManagement.pages',
                path: '/admin/pages',
                title: 'Pages',
                translateKey: 'nav.contentManagement.pages',
                icon: 'page', 
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['admin', 'editor'],
                subMenu: [],
            },
            {
                key: 'contentManagement.categories',
                path: '/admin/categories',
                title: 'Categories',
                translateKey: 'nav.contentManagement.categories',
                icon: 'category', 
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['admin', 'editor'],
                subMenu: [],
            },
            {
                key: 'contentManagement.tags',
                path: '/admin/tags',
                title: 'Tags',
                translateKey: 'nav.contentManagement.tags',
                icon: 'tag',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['admin', 'editor'],
                subMenu: [],
            },
            {
                key: 'contentManagement.comments',
                path: '/admin/comments',
                title: 'Comments',
                translateKey: 'nav.contentManagement.comments',
                icon: 'comment',
                type: NAV_ITEM_TYPE_ITEM,
                authority: ['admin', 'editor'],
                subMenu: [],
            },
            {
                key: 'contentManagement.media',
                path: '', 
                title: 'Media',
                translateKey: 'nav.contentManagement.media',
                icon: '', 
                type: NAV_ITEM_TYPE_COLLAPSE, 
                authority: ['admin', 'editor'],
                subMenu: [
                    {
                        key: 'contentManagement.media.list',
                        path: '/admin/media/list',
                        title: 'Media List',
                        translateKey: 'nav.contentManagement.media.list',
                        icon: 'mediaList',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: ['admin', 'editor'],
                        subMenu: [],
                    },
                    {
                        key: 'contentManagement.media.categories',
                        path: '/admin/media/categories',
                        title: 'Media Categories',
                        translateKey: 'nav.contentManagement.media.categories',
                        icon: 'mediaCategory',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: ['admin', 'editor'],
                        subMenu: [],
                    },
                ],
            },
        ],
    },
]

export default contentManagementNavigationConfig