// src/configs/endpoint.config.js
const endpointConfig = {
    // Auth
    signIn: '/auth/login',
    signUp: '/auth/register',
    signOut: '/auth/logout',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    refreshToken: '/auth/refresh-token',

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
    getAllMenus: '/menu-definitions',
    getMenuById: (id) => `/menu-definitions/id/${id}`,
    getMenuBySlug: (slug) => `/menu-definitions/${slug}`,
    createMenu: '/menu-definitions',
    updateMenu: (id) => `/menu-definitions/id/${id}`,
    deleteMenu: (id) => `/menu-definitions/${id}`,

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
    getAllSocialLinks: '/social',
    getSocialLinkById: (id) => `/social/${id}`,
    createSocialLink: '/social',
    updateSocialLink: (id) => `/social/${id}`,
    deleteSocialLink: (id) => `/social/${id}`,

    // Tags
    getAllTags: '/tags',
    getTagById: (id) => `/tags/id/${id}`,
    getTagBySlug: (slug) => `/tags/${slug}`,
    createTag: '/tags',
    updateTag: (id) => `/tags/id/${id}`,
    deleteTag: (id) => `/tags/${id}`,

    // Users
    getAllUsers: '/users',
    getUserById: (id) => `/users/${id}`,
    createUser: '/users',
    updateUser: (id) => `/users/${id}`,
    deleteUser: (id) => `/users/${id}`,

    // Dashboard
    getDashboardSummary: '/dashboard',
    getAnalyticsData: '/dashboard/analytics',

};

export default endpointConfig;