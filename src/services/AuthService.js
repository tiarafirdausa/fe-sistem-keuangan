import ApiService from './ApiService'
import endpointConfig from '@/configs/endpoint.config'

export async function apiSignIn(data) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.signIn,
        method: 'post',
        data,
    })
}

export async function apiSignOut() {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.signOut,
        method: 'post',
    })
}

export async function apiForgotPassword(data) {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.register,
        method: 'post',
        data,
    })
}

export async function apiGetMe() {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.getMe,
        method: 'get',
    })
}

export async function apiRefreshToken() {
    return ApiService.fetchDataWithAxios({
        url: endpointConfig.refreshToken,
        method: 'post',
    });
}
