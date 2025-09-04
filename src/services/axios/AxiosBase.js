import axios from 'axios'
import appConfig from '@/configs/app.config'
import { useSessionUser } from '@/store/authStore'

let csrfToken = null;

export const fetchCsrfToken = async () => {
    try {
        const response = await axios.get(`${appConfig.backendBaseUrl}/csrf-token`, {
            withCredentials: true,
        });
        csrfToken = response.data.csrfToken;
        return csrfToken;
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        throw error;
    }
};

const unauthorizedCode = [401, 419, 440];

const AxiosBase = axios.create({
    timeout: 60000,
    baseURL: appConfig.backendBaseUrl + appConfig.apiPrefix,
    withCredentials: true,
});

AxiosBase.interceptors.request.use(
    async (config) => {
        const methodsToIncludeCsrf = ['post', 'put', 'delete', 'patch'];
                if (methodsToIncludeCsrf.includes(config.method.toLowerCase())) {
            if (!csrfToken) {
                try {
                    const newToken = await fetchCsrfToken();
                    config.headers['X-CSRF-Token'] = newToken;
                } catch { 
                    return Promise.reject(new Error('Failed to get CSRF token.'));
                }
            } else {
                config.headers['X-CSRF-Token'] = csrfToken;
            }
        }
        
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

AxiosBase.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && unauthorizedCode.includes(error.response.status)) {
            useSessionUser.getState().setUser({});
            useSessionUser.getState().setSessionSignedIn(false);
            csrfToken = null;
        }
        return Promise.reject(error);
    },
);

export default AxiosBase;
