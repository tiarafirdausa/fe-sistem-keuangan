// src/services/axios/csrfService.js
import axios from 'axios';
import appConfig from '@/configs/app.config'; 

let csrfToken = null; 

export const getCsrfToken = () => csrfToken;

export const fetchCsrfToken = async () => {
    try {
        const response = await axios.get(`${appConfig.backendBaseUrl}/auth/csrf-token`, {
            withCredentials: true, 
        });
        csrfToken = response.data.csrfToken;
        console.log('CSRF Token fetched:', csrfToken);
        return csrfToken;
    } catch (error) {
        console.error('Error fetching CSRF token:', error);
        throw error;
    }
};

export const addCsrfTokenToConfig = (config) => {
    const methodsToIncludeCsrf = ['post', 'put', 'delete', 'patch'];
    if (methodsToIncludeCsrf.includes(config.method) && csrfToken) {
        config.headers['X-CSRF-Token'] = csrfToken; 
    }
    return config;
};
