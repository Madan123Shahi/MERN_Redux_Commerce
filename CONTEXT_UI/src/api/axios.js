// src/api/axios.js
import axios from "axios";
import store from "../app/store"; // <-- import redux store

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
});

// 🔐 Attach access token automatically
api.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
