// src/services/PostService.js
import ApiService from './ApiService';
import endpointConfig from '@/configs/endpoint.config';

export async function apiGetAllPosts(params) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getAllPosts,
        method: 'get',
        params,
    });
}

export async function apiGetPostById(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getPostById(id),
        method: 'get',
    });
}

export async function apiGetPostBySlug(slug) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getPostBySlug(slug),
        method: 'get',
    });
}

export async function apiCreatePost(postData, thumbnailFile = null) {
    const formData = new FormData();
    for (const key in postData) {
        formData.append(key, postData[key]);
    }
    if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile); // 'thumbnail' adalah nama field di Multer single()
    }
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.createPost,
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export async function apiUpdatePost(id, postData, thumbnailFile = null) {
    const formData = new FormData();
    for (const key in postData) {
        formData.append(key, postData[key]);
    }
    if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
    }
    // Jika ada flag untuk menghapus thumbnail yang sudah ada tanpa mengganti
    // if (postData.clear_thumbnail === true) {
    //     formData.append('clear_thumbnail', 'true');
    // }
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.updatePost(id),
        method: 'put',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export async function apiDeletePost(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.deletePost(id),
        method: 'delete',
    });
}