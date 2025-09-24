// src/configs/routes.config/contentManagementRoute.js

import { lazy } from 'react'
import { ADMIN_PREFIX_PATH } from '@/constants/route.constant'
import { ADMIN, EDITOR, AUTHOR } from '@/constants/roles.constant'

const contentManagementRoute = [
    {
        key: 'contentManagement.posts',
        path: `${ADMIN_PREFIX_PATH}/posts`,
        component: lazy(() => import('@/views/admin/content/Posts/PostList')),
        authority: [ADMIN, EDITOR, AUTHOR],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'contentManagement.posts.new',
        path: `${ADMIN_PREFIX_PATH}/posts/new`,
        component: lazy(() => import('@/views/admin/content/Posts/PostCreate')),
        authority: [ADMIN, EDITOR, AUTHOR],
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
        authority: [ADMIN, EDITOR, AUTHOR],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: 'Edit Post',
            },
        },
    },

    {
        key: 'contentManagement.pages',
        path: `${ADMIN_PREFIX_PATH}/pages`,
        component: lazy(() => import('@/views/admin/content/Pages/PageList')),
        authority: [ADMIN, EDITOR, AUTHOR],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'contentManagement.pages.new',
        path: `${ADMIN_PREFIX_PATH}/pages/new`,
        component: lazy(() => import('@/views/admin/content/Pages/PageCreate')),
        authority: [ADMIN, EDITOR, AUTHOR],
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
        authority: [ADMIN, EDITOR, AUTHOR],
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
        authority: [ADMIN, EDITOR, AUTHOR],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'contentManagement.categories.new',
        path: `${ADMIN_PREFIX_PATH}/categories/new`,
        component: lazy(
            () => import('@/views/admin/content/Categories/CategoryCreate'),
        ),
        authority: [ADMIN, EDITOR, AUTHOR],
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
        authority: [ADMIN, EDITOR, AUTHOR],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: 'Edit Category',
            },
        },
    },
    {
        key: 'contentManagement.tags',
        path: `${ADMIN_PREFIX_PATH}/tags`,
        component: lazy(() => import('@/views/admin/content/Tags/TagList')),
        authority: [ADMIN, EDITOR, AUTHOR],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'contentManagement.tags.new',
        path: `${ADMIN_PREFIX_PATH}/tags/new`,
        component: lazy(() => import('@/views/admin/content/Tags/TagCreate')),
        authority: [ADMIN, EDITOR, AUTHOR],
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
        component: lazy(() => import('@/views/admin/content/Tags/TagEdit')),
        authority: [ADMIN, EDITOR, AUTHOR],
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
        component: lazy(() => import('@/views/admin/content/Comments/CommentList')),
        authority: [ADMIN, EDITOR, AUTHOR],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'contentManagement.media.list',
        path: `${ADMIN_PREFIX_PATH}/media/list`,
        component: lazy(() => import('@/views/admin/content/Media/MediaList')),
        authority: [ADMIN, EDITOR, AUTHOR],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'contentManagement.media.new',
        path: `${ADMIN_PREFIX_PATH}/media/new`,
        component: lazy(
            () => import('@/views/admin/content/Media/MediaCreate'),
        ),
        authority: [ADMIN, EDITOR, AUTHOR],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: 'Create New Media',
            },
        },
    },
    {
        key: 'contentManagement.media.edit',
        path: `${ADMIN_PREFIX_PATH}/media/edit/:id`,
        component: lazy(
            () => import('@/views/admin/content/Media/MediaEdit'),
        ),
        authority: [ADMIN, EDITOR, AUTHOR],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: 'Edit Media ',
            },
        },
    },

    // Rute untuk Media Categories
    {
        key: 'contentManagement.media.categories',
        path: `${ADMIN_PREFIX_PATH}/media/categories`,
        component: lazy(
            () => import('@/views/admin/content/Media/MediaCategoryList'),
        ),
        authority: [ADMIN, EDITOR, AUTHOR],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'contentManagement.media.categories.new',
        path: `${ADMIN_PREFIX_PATH}/media/categories/new`,
        component: lazy(
            () => import('@/views/admin/content/Media/MediaCategoryCreate'),
        ),
        authority: [ADMIN, EDITOR, AUTHOR],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: 'Create New Media Category',
            },
        },
    },
    {
        key: 'contentManagement.media.categories.edit',
        path: `${ADMIN_PREFIX_PATH}/media/categories/edit/:slug`,
        component: lazy(
            () => import('@/views/admin/content/Media/MediaCategoryEdit'),
        ),
        authority: [ADMIN, EDITOR, AUTHOR],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: 'Edit Media Category',
            },
        },
    },
     {
        key: 'contentManagement.banners',
        path: `${ADMIN_PREFIX_PATH}/banners`,
        component: lazy(() => import('@/views/admin/content/Banners/BannerList')),
        authority: [ADMIN, EDITOR, AUTHOR],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'contentManagement.banners.new',
        path: `${ADMIN_PREFIX_PATH}/banners/new`,
        component: lazy(() => import('@/views/admin/content/Banners/BannerCreate')),
        authority: [ADMIN, EDITOR, AUTHOR],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: 'Create New Banner',
            },
        },
    },
    {
        key: 'contentManagement.banners.edit',
        path: `${ADMIN_PREFIX_PATH}/banners/edit/:id`,
        component: lazy(() => import('@/views/admin/content/Banners/BannerEdit')),
        authority: [ADMIN, EDITOR, AUTHOR],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: 'Edit Banner',
            },
        },
    },
    {
        key: 'contentManagement.links',
        path: `${ADMIN_PREFIX_PATH}/links`,
        component: lazy(() => import('@/views/admin/content/Links/LinkList/LinkList')),
        authority: [ADMIN, EDITOR, AUTHOR],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'contentManagement.links.new',
        path: `${ADMIN_PREFIX_PATH}/links/new`,
        component: lazy(() => import('@/views/admin/content/Links/LinkCreate')),
        authority: [ADMIN, EDITOR, AUTHOR],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: 'Create New Link',
            },
        },
    },
    {
        key: 'contentManagement.links.edit',
        path: `${ADMIN_PREFIX_PATH}/links/edit/:id`,
        component: lazy(() => import('@/views/admin/content/Links/LinkEdit')),
        authority: [ADMIN, EDITOR, AUTHOR],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: 'Edit Link',
            },
        },
    },{
        key: 'appearance.menus.items',
        path: `${ADMIN_PREFIX_PATH}/menus/:menuId/items`,
        component: lazy(() => import('@/views/admin/appearance/Menus/MenuItem/MenuItemList')),
        authority: [ADMIN, EDITOR, AUTHOR],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'appearance.menus.items.new',
        path: `${ADMIN_PREFIX_PATH}/menus/:menuId/items/new`,
        component: lazy(() => import('@/views/admin/appearance/Menus/MenuItem/MenuItemCreate')),
        authority: [ADMIN, EDITOR, AUTHOR],
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
        authority: [ADMIN, EDITOR, AUTHOR],
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
        authority: [ADMIN, EDITOR, AUTHOR],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'appearance.menus.new',
        path: `${ADMIN_PREFIX_PATH}/menus/new`,
        component: lazy(() => import('@/views/admin/appearance/Menus/MenuCreate')),
        authority: [ADMIN, EDITOR, AUTHOR],
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
        authority: [ADMIN, EDITOR, AUTHOR],
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
        authority: [ADMIN, EDITOR, AUTHOR],
        meta: {
            pageContainerType: 'contained',
        },
    },
    {
        key: 'appearance.socialLinks.new',
        path: `${ADMIN_PREFIX_PATH}/social-links/new`,
        component: lazy(() => import('@/views/admin/appearance/SocialLinks/SocialLinkCreate')),
        authority: [ADMIN, EDITOR, AUTHOR],
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
        authority: [ADMIN, EDITOR, AUTHOR],
        meta: {
            pageContainerType: 'contained',
            header: {
                contained: true,
                title: 'Edit Social Link',
            },
        },
    },
];

export default contentManagementRoute;