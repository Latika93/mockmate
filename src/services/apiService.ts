import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

class ApiService {
  private api: AxiosInstance;

  private apiUrl = process.env.API_URL || "http://localhost:5000/";

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add a request interceptor to include the auth token in all requests
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add a response interceptor to handle errors globally
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        // Handle 401 Unauthorized errors (token expired, etc.)
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url, config);
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data, config);
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url, config);
    return response.data;
  }
}

export const apiService = new ApiService();
