import axios, { AxiosError, AxiosInstance } from "axios";

const BASE_URL =import.meta.env.VITE_BASE_URL as string

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Optional: Response / Error interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      return Promise.reject(
        new Error(
          `API Error: ${error.response.status} ${error.response.statusText}`
        )
      );
    }
    return Promise.reject(new Error("Network Error"));
  }
);
