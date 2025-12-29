import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true, // important to send cookies
});

// api.interceptors.response.use(
//   (res) => res,
//   async (err) => {
//     const original = err.config;

//     // 🔥 IMPORTANT: stop infinite loop
//     if (
//       err.response?.status === 401 &&
//       !original._retry &&
//       !original.url.includes("/auth/refresh")
//     ) {
//       original._retry = true;

//       try {
//         const result = await store.dispatch(refreshAccessToken());
//         const token = result.payload;

//         original.headers.Authorization = `Bearer ${token}`;
//         return api(original);
//       } catch {
//         store.dispatch(clearAuth());
//         window.location.href = "/login"; // optional
//       }
//     }

//     return Promise.reject(err);
//   }
// );

export default api;
