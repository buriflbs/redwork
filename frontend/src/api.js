import axios from "axios";

/**
 * Browser always talks to same-origin `/api`.
 * - Production: nginx / ingress proxies /api → FastAPI
 * - Development: src/setupProxy.js proxies /api → REACT_APP_BACKEND_URL or :8001
 *
 * REACT_APP_BACKEND_URL is intentionally NOT used in the browser. Baking
 * localhost into a production bundle is a primary cause of Axios "Network Error".
 */
function getApiBase() {
  const explicit = (process.env.REACT_APP_API_URL || "").trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }
  return "/api";
}

export const API = getApiBase();

const TOKEN_KEY = "redwork_auth_token";
const ADMIN_TOKEN_KEY = "redwork_admin_token";

export const tokenStorage = {
  get: () => {
    try {
      return (
        sessionStorage.getItem(TOKEN_KEY) ||
        localStorage.getItem(TOKEN_KEY) ||
        sessionStorage.getItem(ADMIN_TOKEN_KEY) ||
        localStorage.getItem(ADMIN_TOKEN_KEY)
      );
    } catch {
      return null;
    }
  },
  set: (token, remember = true) => {
    try {
      if (!token) return;
      sessionStorage.setItem(TOKEN_KEY, token);
      if (remember) {
        localStorage.setItem(TOKEN_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch (e) {
      console.warn("Could not save token:", e);
    }
  },
  remove: () => {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_TOKEN_KEY);
    } catch (e) {
      console.warn("Could not remove token:", e);
    }
  },
};

const api = axios.create({
  baseURL: API,
  timeout: 20000,
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
