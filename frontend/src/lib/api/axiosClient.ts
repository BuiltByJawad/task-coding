import axios from "axios";

const apiBaseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const axiosClient = axios.create({
  baseURL: apiBaseURL,
});

axiosClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: we can handle global 401/403 here (e.g., logout) later
    return Promise.reject(error);
  }
);
