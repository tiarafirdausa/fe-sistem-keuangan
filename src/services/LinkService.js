import ApiService from './ApiService';
import endpointConfig from '@/configs/endpoint.config';

export async function apiGetAllLinks(params) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getAllLinks,
        method: 'get',
        params,
    });
}

export async function apiGetLinkById(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getLinkById(id),
        method: 'get',
    });
}

export async function apiCreateLink(formData) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.createLink,
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export async function apiUpdateLink(id, formData) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.updateLink(id),
        method: 'put',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export async function apiDeleteLink(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.deleteLink(id),
        method: 'delete',
    });
}