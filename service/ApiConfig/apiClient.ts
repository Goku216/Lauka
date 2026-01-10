import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class apiClient {
    private client: AxiosInstance;

    constructor(baseURL: string = process.env.NEXT_PUBLIC_BACKEND_API || 'http://testapi.com') {
        this.client = axios.create({
            baseURL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        // Request interceptor
        this.client.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor
        this.client.interceptors.response.use(
            (response) => response.data,
            (error) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    
                }
                return Promise.reject(error);
            }
        );
    }

    get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return this.client.get(url, config);
    }

    post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        return this.client.post(url, data, config);
    }

    put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        return this.client.put(url, data, config);
    }
    patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
        return this.client.patch(url, data, config);
    }



    delete<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
          return this.client.delete(url, {
        ...config,
        data,
    });
    }
}

export default new apiClient();