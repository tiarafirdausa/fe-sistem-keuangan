// src/configs/routes.config/contentManagementRoute.js

import { lazy } from 'react'
import { ADMIN_PREFIX_PATH } from '@/constants/route.constant'
import { ADMIN } from '@/constants/roles.constant'

const contentManagementRoute = [
    {
        key: 'contentManagement.posts',
        path: `${ADMIN_PREFIX_PATH}/posts`,
        component: lazy(() => import('@/views/admin/content/Posts/PostList')), 
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'contentManagement.posts.details',
        path: `${ADMIN_PREFIX_PATH}/posts/details/:slug`,
        component: lazy(() => import('@/views/admin/content/Posts/PostDetails')), 
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
        header: {
                contained: true,
                title: lazy(
                    () =>
                        import(
                            '@/views/admin/content/Posts/PostDetails/components/PostDetailHeader'
                        )
                ),
                extraHeader: lazy(
                    () =>
                        import(
                            '@/views/admin/content/Posts/PostDetails/components/PostDetailHeaderExtra'
                        )
                ),
            },
        },
    },
    {
        key: 'contentManagement.pages',
        path: `${ADMIN_PREFIX_PATH}/pages`,
        component: lazy(() => import('@/views/admin/content/Pages')), 
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'contentManagement.categories',
        path: `${ADMIN_PREFIX_PATH}/categories`,
        component: lazy(() => import('@/views/admin/content/Categories')), 
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'contentManagement.tags',
        path: `${ADMIN_PREFIX_PATH}/tags`,
        component: lazy(() => import('@/views/admin/content/Tags')), 
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'contentManagement.comments',
        path: `${ADMIN_PREFIX_PATH}/comments`,
        component: lazy(() => import('@/views/admin/content/Comments')), 
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'contentManagement.media',
        path: `${ADMIN_PREFIX_PATH}/media`,
        component: lazy(() => import('@/views/admin/content/Media')), 
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
        },
    },
]

export default contentManagementRoute