import ApiService from './ApiService';
import endpointConfig from '@/configs/endpoint.config';

// === Media Endpoints ===

export async function apiGetAllMediaCollections(params) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getAllMediaCollections,
        method: 'get',
        params,
    });
}

export async function apiGetMediaCollectionById(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getMediaCollectionById(id),
        method: 'get',
    });
}

export async function apiCreateMediaCollection(data) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.createMediaCollection,
        method: 'post',
        data,
        headers: { 'Content-Type': 'multipart/form-data' },
    });
}

export async function apiUpdateMediaCollection(id, data) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.updateMediaCollection(id),
        method: 'put',
        data,
        headers: { 'Content-Type': 'multipart/form-data' },
    });
}

export async function apiDeleteMediaCollection(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.deleteMediaCollection(id),
        method: 'delete',
    });
}

// === Media Category Endpoints ===

export async function apiGetAllMediaCategories(params) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getAllMediaCategories,
        method: 'get',
        params,
    });
}

export async function apiGetMediaCategoryById(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getMediaCategoryById(id),
        method: 'get',
    });
}

export async function apiGetMediaCategoryBySlug(slug) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getMediaCategoryBySlug(slug),
        method: 'get',
    });
}

export async function apiCreateMediaCategory(data) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.createMediaCategory,
        method: 'post',
        data,
    });
}

export async function apiUpdateMediaCategory(id, data) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.updateMediaCategory(id),
        method: 'put',
        data,
    });
}

export async function apiDeleteMediaCategory(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.deleteMediaCategory(id),
        method: 'delete',
    });
}