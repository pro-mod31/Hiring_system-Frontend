import axios from "axios";
import { getUserFromStorage } from "../utils/storage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // https://xxx.ngrok-free.dev/api/v1
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Attach JWT Bearer token on every request
api.interceptors.request.use((config) => {
  const user = getUserFromStorage();
  if (user?.token) {
    config.headers!.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auto-logout on 401 — but only when NOT on the login/signup page
// (avoids redirect loop and allows login errors to display properly)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (
      err.response?.status === 401 &&
      !window.location.pathname.includes("/login") &&
      !window.location.pathname.includes("/signup")
    ) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

/**
 * Unwrap the standard { success, data } envelope.
 * Falls back to res.data if no .data property.
 */
export function unwrap<T>(res: any): T {
  return res.data?.data ?? res.data;
}

export default api;
