import axios from "axios";
import { useAuthStore } from "../zustand/authStore";
import { refreshToken } from "./authApi";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true, // 🔥 send cookies for refresh token
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
        console.log(res);
        useAuthStore
          .getState()
          .setAuth(res.data.det.user, res.data.det.newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${res.data.det.newAccessToken}`;
        return api(originalRequest);
      } catch {
        useAuthStore.getState().clearAuth();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
