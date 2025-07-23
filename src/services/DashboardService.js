// src/services/DashboardService.js
import ApiService from './ApiService';
import endpointConfig from '@/configs/endpoint.config';

export async function apiGetDashboardSummary() {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getDashboardSummary,
        method: 'get',
    });
}

export async function apiGetAnalyticsData(params) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getAnalyticsData,
        method: 'get',
        params,
    });
}