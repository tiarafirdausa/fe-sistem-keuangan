import axios from 'axios'
import AxiosResponseIntrceptorErrorCallback from './AxiosResponseIntrceptorErrorCallback'
import AxiosRequestIntrceptorConfigCallback from './AxiosRequestIntrceptorConfigCallback'
import appConfig from '@/configs/app.config'
import { addCsrfTokenToConfig } from './csrfService'

const AxiosBase = axios.create({
    timeout: 60000,
    baseURL: appConfig.backendBaseUrl + appConfig.apiPrefix,
    withCredentials: true,
})

AxiosBase.interceptors.request.use(
    (config) => {
        let updatedConfig = AxiosRequestIntrceptorConfigCallback(config);
        updatedConfig = addCsrfTokenToConfig(updatedConfig); 
        return updatedConfig;
    },
    (error) => {
        return Promise.reject(error)
    },
)

AxiosBase.interceptors.response.use(
    (response) => response,
    (error) => {
        AxiosResponseIntrceptorErrorCallback(error)
        return Promise.reject(error)
    },
)

export default AxiosBase
