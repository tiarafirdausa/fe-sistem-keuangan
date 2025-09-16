import axios from 'axios'
import appConfig from '@/configs/app.config'
import { useSessionUser } from '@/store/authStore'
import { fetchCsrfToken, getCsrfToken, resetCsrfToken } from "./csrfService";

const unauthorizedCode = [401, 419, 440];

const AxiosBase = axios.create({
    timeout: 60000,
    baseURL: appConfig.backendBaseUrl + appConfig.apiPrefix,
    withCredentials: true,
});

// Request Interceptor
AxiosBase.interceptors.request.use(
  async (config) => {
    const methodsToIncludeCsrf = ["post", "put", "delete", "patch"];
    if (methodsToIncludeCsrf.includes(config.method.toLowerCase())) {
      let token = getCsrfToken();
      if (!token) {
        try {
          token = await fetchCsrfToken();
        } catch {
          return Promise.reject(new Error("Failed to get CSRF token."));
        }
      }
      config.headers["X-CSRF-Token"] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
AxiosBase.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && unauthorizedCode.includes(error.response.status)) {
      useSessionUser.getState().setUser({});
      useSessionUser.getState().setSessionSignedIn(false);
      resetCsrfToken();
    }
    return Promise.reject(error);
  }
);

export default AxiosBase;