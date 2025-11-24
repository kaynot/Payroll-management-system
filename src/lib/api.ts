// src/lib/api.ts
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseURL = "http://localhost:7002/api";

// Create Axios instance
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---- REQUEST INTERCEPTOR ----
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ---- RESPONSE INTERCEPTOR ----
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // Handle unauthorized request (token expired or invalid)
    if (status === 401 || status === 403) {
      localStorage.removeItem("authToken");

      // Avoid crashing on pages outside React Router
      try {
        const navigate = useNavigate();
        navigate("/", { replace: true });
      } catch {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
