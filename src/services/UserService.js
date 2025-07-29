// src/services/UserService.js
import ApiService from './ApiService'
import endpointConfig from '@/configs/endpoint.config'

export async function apiCreateUser(formData) { 
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.createUser,
        method: 'post',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data', 
        },
    });
}

export async function apiGetAllUsers(params) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getAllUsers,
        method: 'get',
        params, 
    })
}

export async function apiGetUserById(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getUserById(id),
        method: 'get',
    })
}

export async function apiUpdateUser(id, formData) { 
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.updateUser(id),
        method: 'put', 
        data: formData, 
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export async function apiDeleteUser(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.deleteUser(id),
        method: 'delete',
    })
}