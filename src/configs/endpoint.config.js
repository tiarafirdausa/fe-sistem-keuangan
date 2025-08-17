// src/configs/endpoint.config.js
const endpointConfig = {
    // Auth
    signIn: '/login',
    signOut: '/logout',
    forgotPassword: '/forgotpassword',
    resetPassword: '/resetpassword',
    refreshToken: '/refresh-token',
    getMe: '/me',

    // User Management
    createUser: '/users', 
    getAllUsers: '/users',
    getUserById: (id) => `/users/${id}`,
    updateUser: (id) => `/users/${id}`,
    deleteUser: (id) => `/users/${id}`,

    // Media
    getAllMediaCollections: `/media`,
    getMediaCollectionById: (id) => `/media/id/${id}`,
    createMediaCollection: `/media`,
    updateMediaCollection: (id) => `/media/${id}`,
    deleteMediaCollection: (id) => `/media/${id}`,

    // Endpoints untuk Media Categories
    getAllMediaCategories: `/media-categories`,
    getMediaCategoryById: (id) => `/media-categories/id/${id}`,
    getMediaCategoryBySlug: (slug) => `/media-categories/${slug}`,
    createMediaCategory: `/media-categories`,
    updateMediaCategory: (id) => `/media-categories/${id}`,
    deleteMediaCategory: (id) => `/media-categories/${id}`,

    // Categories (untuk posts/pages)
    getAllCategories: '/categories',
    getCategoryById: (id) => `/categories/id/${id}`,
    getCategoryBySlug: (slug) => `/categories/${slug}`,
    createCategory: '/categories',
    updateCategory: (id) => `/categories/${id}`,
    deleteCategory: (id) => `/categories/${id}`,

    // Posts
    getAllPosts: '/posts',
    getPostById: (id) => `/posts/${id}`,
    getPostBySlug: (slug) => `/posts/${slug}`,
    createPost: '/posts',
    updatePost: (id) => `/posts/id/${id}`,
    deletePost: (id) => `/posts/${id}`,

    // Pages
    getAllPages: '/pages',
    getPageById: (id) => `/pages/id/${id}`,
    getPageBySlug: (slug) => `/pages/${slug}`,
    createPage: '/pages',
    updatePage: (id) => `/pages/${id}`,
    deletePage: (id) => `/pages/${id}`,

    // Comments
    getAllComments: '/comments',
    getCommentById: (id) => `/comments/post/${id}`,
    createComment: '/comments',
    deleteComment: (id) => `/comments/${id}`,
    updateCommentStatus: (id) => `/comments/${id}/status`,

    // Menus
    getAllMenus: '/menus',
    getMenuById: (id) => `/menus/id/${id}`,
    getMenuBySlug: (slug) => `/menus/${slug}`,
    createMenu: '/menus',
    updateMenu: (id) => `/menus/${id}`,
    deleteMenu: (id) => `/menus/${id}`,
    getMenuWithItem: (slug) => `/menus/with-items/${slug}`,

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

    // Modul
    getAllModuls: '/moduls',
    getModulById: (id) => `/moduls/${id}`,
    createModul: '/moduls',
    updateModul: (id) => `/moduls/${id}`,
    deleteModul: (id) => `/moduls/${id}`,

    uploadTinyMCEImage: '/upload/tinymce-image',
    uploadTinyMCEVideo: '/upload/tinymce-video',

    // Dashboard
    getDashboardSummary: '/dashboard/summary', // Endpoint untuk ringkasan
    getRecentPosts: '/posts?limit=5&sort=desc', // Contoh: untuk postingan terbaru
    getRecentComments: '/comments?limit=5&sort=desc', // Contoh: untuk komentar terbaru
    getAnalyticsData: '/dashboard/analytics', 

};

export default endpointConfig;