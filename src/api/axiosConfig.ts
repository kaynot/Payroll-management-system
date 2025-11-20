import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: "http://localhost:7002/api",
});

// Global response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // If unauthorized → auto logout
    if (status === 401) {
      toast.error("Session expired. Please sign in again.");

      // Clear storage
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      // Hard redirect to login
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default api;
