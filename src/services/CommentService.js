// src/services/CommentService.js
import ApiService from './ApiService';
import endpointConfig from '@/configs/endpoint.config';

export async function apiGetAllComments(params) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getAllComments,
        method: 'get',
        params,
    });
}

export async function apiGetCommentById(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getCommentById(id),
        method: 'get',
    });
}

export async function apiCreateComment(data) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.createComment,
        method: 'post',
        data,
    });
}

export async function apiDeleteComment(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.deleteComment(id),
        method: 'delete',
    });
}

export async function apiUpdateCommentStatus(id, data) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.updateCommentStatus(id), 
        method: 'put',
        data,
    });
}