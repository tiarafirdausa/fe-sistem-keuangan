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
        key: 'contentManagement.posts.new',
        path: `${ADMIN_PREFIX_PATH}/posts/new`,
        component: lazy(() => import('@/views/admin/content/Posts/PostCreate')),
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: 'Create New Post',
            },
        },
    },
    {
        key: 'contentManagement.posts.edit',
        path: `${ADMIN_PREFIX_PATH}/posts/edit/:slug`,
        component: lazy(() => import('@/views/admin/content/Posts/PostEdit')),
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: 'Edit Post',
            },
        },
    },
    {
        key: 'contentManagement.posts.details',
        path: `${ADMIN_PREFIX_PATH}/posts/details/:slug`,
        component: lazy(
            () => import('@/views/admin/content/Posts/PostDetails'),
        ),
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: lazy(
                    () =>
                        import(
                            '@/views/admin/content/Posts/PostDetails/components/PostDetailHeader'
                        ),
                ),
                extraHeader: lazy(
                    () =>
                        import(
                            '@/views/admin/content/Posts/PostDetails/components/PostDetailHeaderExtra'
                        ),
                ),
            },
        },
    },
    {
        key: 'contentManagement.pages',
        path: `${ADMIN_PREFIX_PATH}/pages`,
        component: lazy(() => import('@/views/admin/content/Pages/PageList')),
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'contentManagement.pages.new',
        path: `${ADMIN_PREFIX_PATH}/pages/new`,
        component: lazy(() => import('@/views/admin/content/Pages/PageCreate')),
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: 'Create New Page',
            },
        },
    },
    {
        key: 'contentManagement.pages.edit',
        path: `${ADMIN_PREFIX_PATH}/pages/edit/:slug`,
        component: lazy(() => import('@/views/admin/content/Pages/PageEdit')),
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: 'Edit Page',
            },
        },
    },
    {
        key: 'contentManagement.categories',
        path: `${ADMIN_PREFIX_PATH}/categories`,
        component: lazy(
            () => import('@/views/admin/content/Categories/CategoryList'),
        ),
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'contentManagement.categories.new',
        path: `${ADMIN_PREFIX_PATH}/categories/new`,
        component: lazy(() => import('@/views/admin/content/Categories/CategoryCreate')),
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: 'Create New Category',
            },
        },
    },
    {
        key: 'contentManagement.categories.edit',
        path: `${ADMIN_PREFIX_PATH}/categories/edit/:slug`,
        component: lazy(
            () => import('@/views/admin/content/Categories/CategoryEdit'),
        ),
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: 'Edit Tag',
            },
        },
    },
    {
        key: 'contentManagement.tags',
        path: `${ADMIN_PREFIX_PATH}/tags`,
        component: lazy(() => import('@/views/admin/content/Tags/TagList')),
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'contentManagement.tags.new',
        path: `${ADMIN_PREFIX_PATH}/tags/new`,
        component: lazy(() => import('@/views/admin/content/Tags/TagCreate')),
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: 'Create New Tag',
            },
        },
    },
    {
        key: 'contentManagement.tags.edit',
        path: `${ADMIN_PREFIX_PATH}/tags/edit/:slug`,
        component: lazy(
            () => import('@/views/admin/content/Tags/TagEdit'),
        ),
        authority: [ADMIN],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: 'Edit Tag',
            },
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
