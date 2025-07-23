// src/services/SocialLinkService.js
import ApiService from './ApiService';
import endpointConfig from '@/configs/endpoint.config';

export async function apiGetAllSocialLinks(params) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getAllSocialLinks,
        method: 'get',
        params,
    });
}

export async function apiGetSocialLinkById(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getSocialLinkById(id),
        method: 'get',
    });
}

export async function apiCreateSocialLink(data) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.createSocialLink,
        method: 'post',
        data,
    });
}

export async function apiUpdateSocialLink(id, data) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.updateSocialLink(id),
        method: 'put',
        data,
    });
}

export async function apiDeleteSocialLink(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.deleteSocialLink(id),
        method: 'delete',
    });
}