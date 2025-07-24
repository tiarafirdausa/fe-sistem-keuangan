// src/services/PostService.js
import ApiService from './ApiService'
import endpointConfig from '@/configs/endpoint.config'

export async function apiGetAllPosts(params) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getAllPosts,
        method: 'get',
        params,
    })
}

export async function apiGetPostById(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getPostById(id),
        method: 'get',
    })
}

export async function apiGetPostBySlug(slug) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getPostBySlug(slug),
        method: 'get',
    })
}

export async function apiCreatePost(data) {
    const formData = new FormData()
    for (const [key, value] of Object.entries(data)) {
        if (key === 'featured_image' && value instanceof File) {
            formData.append(key, value, value.name)
        } else if (Array.isArray(value)) {
            value.forEach((item) => formData.append(`${key}[]`, item))
        } else {
            formData.append(key, value)
        }
    }
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.createPost,
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export async function apiUpdatePost(id, data) {
    const formData = new FormData()
    for (const [key, value] of Object.entries(data)) {
        if (key === 'featured_image' && value instanceof File) {
            formData.append(key, value, value.name)
        } else if (Array.isArray(value)) {
            value.forEach((item) => formData.append(`${key}[]`, item))
        } else {
            formData.append(key, value)
        }
    }

    return ApiService.fetchDataWithAxios({
        url: endpointConfig.updatePost(id),
        method: 'put',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export async function apiDeletePost(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.deletePost(id),
        method: 'delete',
    })
}
