// src/configs/routes.config/PublicPageRoute.js
import { lazy } from 'react'

const PublicPageRoute = [
    // Rute Publik (Landing Page)
    {
        key: 'home',
        path: '/', 
        component: lazy(() => import('@/views/public')),
        authority: [], 
    },
    // // Rute List Post
    // {
    //     key: 'post.list',
    //     path: '/posts',
    //     component: lazy(() => import('@/views/PostList')),
    //     authority: [],
    // },
    // // Rute Detail Post
    // {
    //     key: 'post.detail',
    //     path: '/post/:slug',
    //     component: lazy(() => import('@/views/PostDetail')),
    //     authority: [],
    // },
    // // Rute Detail Halaman
    {
        key: 'page',
        path: '/:slug',
        component: lazy(() => import('@/views/public/PageDetail')),
        authority: [],
    },
]

export default PublicPageRoute