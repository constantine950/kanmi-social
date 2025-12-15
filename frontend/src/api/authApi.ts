import api from "./axios";

export const registerUser = (formData: FormData) =>
  api.post("/auth/register", formData);

export const loginUser = (data: { username: string; password: string }) =>
  api.post("/auth/login", data);

export const refreshToken = () => api.post("/auth/refresh");

export const logoutUser = () => api.post("/auth/logout");
