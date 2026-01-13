import axios from "axios";
import { useAuthStore } from "../zustand/authStore";
import { refreshToken } from "./authApi";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

// Request interceptor: attach access token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: auto refresh token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await refreshToken();
        useAuthStore.getState().setAuth(res.data.user, res.data.newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${res.data.newAccessToken}`;
        return api(originalRequest);
      } catch {
        useAuthStore.getState().clearAuth();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
