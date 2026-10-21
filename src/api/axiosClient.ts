import axios from 'axios';
import { API_BASE_URL } from '../constants/env';
import { useAuthStore } from '../store/useAuthStore';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Tự động gắn Bearer Token vào header
axiosClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().userToken || useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Tự động logout nếu gặp lỗi 401
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
