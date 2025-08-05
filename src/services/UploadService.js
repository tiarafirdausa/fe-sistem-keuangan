// src/services/UploadService.js
import ApiService from './ApiService'
import endpointConfig from '@/configs/endpoint.config'

export async function apiUploadTinyMCEImage(formData) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.uploadTinyMCEImage, 
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export async function apiUploadTinyMCEVideo(formData) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.uploadTinyMCEVideo, 
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}