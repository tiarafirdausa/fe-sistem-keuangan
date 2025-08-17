// src/services/ModulService.js
import ApiService from './ApiService';
import endpointConfig from '@/configs/endpoint.config';

export async function apiGetAllModuls(params) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getAllModuls,
        method: 'get',
        params,
    });
}

export async function apiGetModulById(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getModulById(id),
        method: 'get',
    });
}

export async function apiCreateModul(data) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.createModul,
        method: 'post',
        data,
    });
}

export async function apiUpdateModul(id, data) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.updateModul(id),
        method: 'put',
        data,
    });
}

export async function apiDeleteModul(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.deleteModul(id),
        method: 'delete',
    });
}