import ApiService from './ApiService';
import endpointConfig from '@/configs/endpoint.config';

// === Media Endpoints ===

export async function apiGetAllMedia(params) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getAllMedia,
        method: 'get',
        params,
    });
}

export async function apiGetMediaById(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getMediaById(id),
        method: 'get',
    });
}

export async function apiGetMediaByCategorySlug(slug) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getMediaByCategorySlug(slug),
        method: 'get',
    });
}

export async function apiCreateMedia(data) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.createMedia,
        method: 'post',
        data,
        headers: { 'Content-Type': 'multipart/form-data' },
    });
}

export async function apiUpdateMedia(id, data) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.updateMedia(id),
        method: 'put',
        data,
        headers: { 'Content-Type': 'multipart/form-data' },
    });
}

export async function apiDeleteMedia(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.deleteMedia(id),
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