// src/services/TagService.js
import ApiService from './ApiService';
import endpointConfig from '@/configs/endpoint.config';

export async function apiGetAllTags(params) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getAllTags,
        method: 'get',
        params,
    });
}

export async function apiGetTagById(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getTagById(id),
        method: 'get',
    });
}

export async function apiCreateTag(data) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.createTag,
        method: 'post',
        data,
    });
}

export async function apiUpdateTag(id, data) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.updateTag(id),
        method: 'put',
        data,
    });
}

export async function apiDeleteTag(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.deleteTag(id),
        method: 'delete',
    });
}