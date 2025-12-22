import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

const baseURL = (import.meta.env.VITE_API_URL as string) || '';

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      // @ts-ignore
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore storage errors in non-browser environments
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    }
    return Promise.reject(err);
  }
);

export default api;