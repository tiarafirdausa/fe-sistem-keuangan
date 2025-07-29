// src/services/PageService.js
import ApiService from './ApiService';
import endpointConfig from '@/configs/endpoint.config';

export async function apiGetAllPages(params) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getAllPages,
        method: 'get',
        params,
    });
}

export async function apiGetPageById(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getPageById(id),
        method: 'get',
    });
}

export async function apiGetPageBySlug(slug) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getPageBySlug(slug),
        method: 'get',
    });
}

export async function apiCreatePage(formData) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.createPage,
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export async function apiUpdatePage(id,formData) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.updatePage(id),
        method: 'put',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export async function apiDeletePage(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.deletePage(id),
        method: 'delete',
    });
}