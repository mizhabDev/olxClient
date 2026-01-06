import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// we will attach the interceptor later
export const setupInterceptors = (setIsAuthenticated) => {
  api.interceptors.response.use(
    res => res,
    err => {
      if (err.response?.status === 401) {
        setIsAuthenticated(false);
        window.location.href = "/login";
      }
      return Promise.reject(err);
    }
  );
};

export default api;
