// src/configs/endpoint.config.js
const endpointConfig = {
    // Auth
    signIn: '/login',
    signUp: '/register',
    signOut: '/logout',
    forgotPassword: '/forgot-password',
    resetPassword: '/reset-password',
    refreshToken: '/refresh-token',

    // Media
    getAllMedia: '/media',
    getMediaById: (id) => `/media/id/${id}`,
    getMediaByCategorySlug: (slug) => `/media/category/${slug}`,
    createMedia: '/media',
    updateMedia: (id) => `/media/id/${id}`,
    deleteMedia: (id) => `/media/${id}`,

    // Categories (untuk posts/pages)
    getAllCategories: '/categories',
    getCategoryById: (id) => `/categories/id/${id}`,
    getCategoryBySlug: (slug) => `/categories/${slug}`,
    createCategory: '/categories',
    updateCategory: (id) => `/categories/id/${id}`,
    deleteCategory: (id) => `/categories/${id}`,

    // Posts
    getAllPosts: '/posts',
    getPostById: (id) => `/posts/id/${id}`,
    getPostBySlug: (slug) => `/posts/${slug}`,
    createPost: '/posts',
    updatePost: (id) => `/posts/id/${id}`,
    deletePost: (id) => `/posts/${id}`,

    // Pages
    getAllPages: '/pages',
    getPageById: (id) => `/pages/id/${id}`,
    getPageBySlug: (slug) => `/pages/${slug}`,
    createPage: '/pages',
    updatePage: (id) => `/pages/id/${id}`,
    deletePage: (id) => `/pages/${id}`,

    // Comments
    getAllComments: '/comments',
    getCommentById: (id) => `/comments/post/${id}`,
    createComment: '/comments',
    deleteComment: (id) => `/comments/${id}`,
    approveComment: (id) => `/comments/${id}/approve`,
    unapproveComment: (id) => `/comments/${id}/unapprove`,

    // Menus
    getAllMenus: '/menus',
    getMenuById: (id) => `/menus/id/${id}`,
    getMenuBySlug: (slug) => `/menus/${slug}`,
    createMenu: '/menus',
    updateMenu: (id) => `/menus/${id}`,
    deleteMenu: (id) => `/menus/${id}`,

    // Menu Items
    getAllMenuItems: '/menu-items', 
    getMenuItemById: (id) => `/menu-items/${id}`,
    createMenuItem: '/menu-items',
    updateMenuItem: (id) => `/menu-items/${id}`,
    deleteMenuItem: (id) => `/menu-items/${id}`,

    // Settings
    getSettings: '/settings',
    updateSettings: '/settings',

    // Social Links
    getAllSocialLinks: '/socials',
    getSocialLinkById: (id) => `/socials/${id}`,
    createSocialLink: '/socials',
    updateSocialLink: (id) => `/socials/${id}`,
    deleteSocialLink: (id) => `/socials/${id}`,

    // Tags
    getAllTags: '/tags',
    getTagById: (id) => `/tags/id/${id}`,
    getTagBySlug: (slug) => `/tags/${slug}`,
    createTag: '/tags',
    updateTag: (id) => `/tags/${id}`,
    deleteTag: (id) => `/tags/${id}`,

    // Dashboard
    getDashboardSummary: '/dashboard/summary', // Endpoint untuk ringkasan
    getRecentPosts: '/posts?limit=5&sort=desc', // Contoh: untuk postingan terbaru
    getRecentComments: '/comments?limit=5&sort=desc', // Contoh: untuk komentar terbaru
    getAnalyticsData: '/dashboard/analytics', 

};

export default endpointConfig;