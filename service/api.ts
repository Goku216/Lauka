import apiClient from "./ApiConfig/apiClient";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    access: string;
    refresh: string;
}

export const login = async (data: LoginPayload): Promise<any> => {
    try {
        const response = await apiClient.post<any>("/auth/login/", data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || "Login failed");
    }
};
