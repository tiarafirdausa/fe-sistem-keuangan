// src/services/axios/csrfService.js
import axios from 'axios';
import appConfig from '@/configs/app.config'; 

let csrfToken = null; 

export const getCsrfToken = () => csrfToken;

export const fetchCsrfToken = async () => {
  const response = await axios.get(`${appConfig.backendBaseUrl}/csrf-token`, {
    withCredentials: true,
  });
  csrfToken = response.data.csrfToken;
  return csrfToken;
};

export const resetCsrfToken = () => {
  csrfToken = null;
};