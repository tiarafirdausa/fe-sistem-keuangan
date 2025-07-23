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
    // Jika ada file seperti logo atau favicon di settings, gunakan FormData
    // Contoh jika 'logo' atau 'favicon' bisa berupa File object
    // const formData = new FormData();
    // for (const key in data) {
    //     if (data[key] instanceof File) {
    //         formData.append(key, data[key]);
    //     } else {
    //         formData.append(key, data[key]);
    //     }
    // }
    // return ApiService.fetchDataWithAxios({
    //     url: endpointConfig.updateSettings,
    //     method: 'put',
    //     data: formData,
    //     headers: {
    //         'Content-Type': 'multipart/form-data',
    //     },
    // });
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.updateSettings,
        method: 'put',
        data,
    });
}