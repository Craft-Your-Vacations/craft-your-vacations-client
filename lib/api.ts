import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const client: AxiosInstance = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15_000,
});

client.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const message =
        (error.response?.data as { message?: string })?.message ??
        error.message ??
        "An unexpected error occurred";
      return Promise.reject(new Error(message));
    }
    return Promise.reject(error);
  },
);

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    client.get<T>(url, config).then((r) => r.data),

  post: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    client.post<T>(url, body, config).then((r) => r.data),

  put: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    client.put<T>(url, body, config).then((r) => r.data),

  patch: <T>(url: string, body?: unknown, config?: AxiosRequestConfig) =>
    client.patch<T>(url, body, config).then((r) => r.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    client.delete<T>(url, config).then((r) => r.data),

  putForm: <T>(url: string, formData: FormData, config?: AxiosRequestConfig) =>
    client.putForm<T>(url, formData, config).then((r) => r.data),

  postForm: <T>(url: string, formData: FormData, config?: AxiosRequestConfig) =>
    client.postForm<T>(url, formData, config).then((r) => r.data),
};
