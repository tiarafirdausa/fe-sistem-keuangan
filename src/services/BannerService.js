import ApiService from './ApiService';
import endpointConfig from '@/configs/endpoint.config';

export async function apiGetAllBanners(params) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getAllBanners,
        method: 'get',
        params,
    });
}

export async function apiGetBannerById(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getBannerById(id),
        method: 'get',
    });
}

export async function apiCreateBanner(formData) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.createBanner,
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export async function apiUpdateBanner(id, formData) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.updateBanner(id),
        method: 'put',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export async function apiDeleteBanner(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.deleteBanner(id),
        method: 'delete',
    });
}