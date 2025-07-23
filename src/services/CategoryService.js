// src/services/CategoryService.js
import ApiService from './ApiService';
import endpointConfig from '@/configs/endpoint.config';

export async function apiGetAllCategories(params) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getAllCategories,
        method: 'get',
        params,
    });
}

export async function apiGetCategoryById(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getCategoryById(id),
        method: 'get',
    });
}

export async function apiGetCategoryBySlug(slug) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getCategoryBySlug(slug),
        method: 'get',
    });
}

export async function apiCreateCategory(data) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.createCategory,
        method: 'post',
        data,
    });
}

export async function apiUpdateCategory(id, data) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.updateCategory(id),
        method: 'put',
        data,
    });
}

export async function apiDeleteCategory(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.deleteCategory(id),
        method: 'delete',
    });
}