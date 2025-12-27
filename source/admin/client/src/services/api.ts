import axios, { AxiosError } from "axios";
import type { ApiError } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

// Create axios instance with credentials for cookie-based auth
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send cookies with every request
});

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const isLoginRequest = error.config?.url?.includes("/auth/login");

    if (error.response?.status === 401 && !isLoginRequest) {
      // Token expired or invalid - clear user data and redirect
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
