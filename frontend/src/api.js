import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || window.location.origin;
export const API = `${BACKEND_URL.replace(/\/$/, "")}/api`;

const TOKEN_KEY = "redwork_auth_token";

export const tokenStorage = {
  get: () => {
    try {
      return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem("redwork_admin_token") || localStorage.getItem("redwork_admin_token");
    } catch {
      return null;
    }
  },
  set: (token) => {
    try {
      if (token) {
        sessionStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(TOKEN_KEY, token);
      }
    } catch (e) {
      console.warn("Could not save token:", e);
    }
  },
  remove: () => {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem("redwork_admin_token");
      localStorage.removeItem("redwork_admin_token");
    } catch (e) {
      console.warn("Could not remove token:", e);
    }
  },
};

const api = axios.create({
  baseURL: API,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (err) => {
    if (err.response?.status === 401 && window.location.pathname.startsWith("/admin")) {
      tokenStorage.remove();
      if (!window.location.pathname.endsWith("/login")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
