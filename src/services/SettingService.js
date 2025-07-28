// src/services/SettingsService.js
import ApiService from './ApiService';
import endpointConfig from '@/configs/endpoint.config';

export async function apiGetSettings() {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getSettings,
        method: 'get',
    });
}

export async function apiUpdateSettings(data) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.updateSettings,
        method: 'put',
        data,
        headers: {
            'Content-Type': 'multipart/form-data', // Important for file uploads
        },
    });
}