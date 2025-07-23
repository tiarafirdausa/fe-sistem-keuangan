// src/services/MediaService.js
import ApiService from './ApiService';
import endpointConfig from '@/configs/endpoint.config';

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

export async function apiCreateMedia(mediaData, files) {
    // mediaData: { label, category_id, uploaded_by }
    // files: Array of File objects from input type="file"
    const formData = new FormData();
    formData.append('label', mediaData.label);
    formData.append('category_id', mediaData.category_id);
    formData.append('uploaded_by', mediaData.uploaded_by);

    files.forEach((file) => {
        formData.append('files', file); // 'files' adalah nama field di Multer array()
    });

    return ApiService.fetchDataWithAxios({
        url: endpointConfig.createMedia,
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export async function apiUpdateMedia(id, mediaData, newFile = null) {
    // mediaData: { label, type, category_id, uploaded_by, clear_file }
    // newFile: Single File object (jika mengganti file)
    const formData = new FormData();
    if (mediaData.label !== undefined) formData.append('label', mediaData.label);
    if (mediaData.type !== undefined) formData.append('type', mediaData.type);
    if (mediaData.category_id !== undefined) formData.append('category_id', mediaData.category_id);
    if (mediaData.uploaded_by !== undefined) formData.append('uploaded_by', mediaData.uploaded_by);
    if (mediaData.clear_file !== undefined) formData.append('clear_file', mediaData.clear_file);

    if (newFile) {
        formData.append('files', newFile); // 'files' adalah nama field di Multer array()
    }

    return ApiService.fetchDataWithAxios({
        url: endpointConfig.updateMedia(id),
        method: 'put',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export async function apiDeleteMedia(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.deleteMedia(id),
        method: 'delete',
    });
}

// Tambahan: Untuk mengelola Kategori Media jika diperlukan CRUD terpisah
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