import axios from "axios";
import { getToken, setToken, clearToken } from "../services/tokenService.js";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true, // 🔥 REQUIRED for refresh token cookie
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;

      try {
        const res = await api.get("/auth/refresh");
        setToken(res.data.accessToken);
        return api(original);
      } catch {
        clearToken();
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);
export default api;
