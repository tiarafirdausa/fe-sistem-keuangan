// src/services/MenuService.js (Untuk menu definitions)
import ApiService from './ApiService';
import endpointConfig from '@/configs/endpoint.config';

export async function apiGetAllMenus(params) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getAllMenus,
        method: 'get',
        params,
    });
}

export async function apiGetMenuById(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getMenuById(id),
        method: 'get',
    });
}

export async function apiGetMenuBySlug(slug) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getMenuBySlug(slug),
        method: 'get',
    });
}

export async function apiCreateMenu(data) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.createMenu,
        method: 'post',
        data,
    });
}

export async function apiUpdateMenu(id, data) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.updateMenu(id),
        method: 'put',
        data,
    });
}

export async function apiDeleteMenu(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.deleteMenu(id),
        method: 'delete',
    });
}

export async function apiGetAllMenuItems(params) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getAllMenuItems,
        method: 'get',
        params, 
    });
}

export async function apiGetMenuItemById(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getMenuItemById(id),
        method: 'get',
    });
}

export async function apiCreateMenuItem(data) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.createMenuItem,
        method: 'post',
        data,
    });
}

export async function apiUpdateMenuItem(id, data) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.updateMenuItem(id),
        method: 'put',
        data,
    });
}

export async function apiDeleteMenuItem(id) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.deleteMenuItem(id),
        method: 'delete',
    });
}