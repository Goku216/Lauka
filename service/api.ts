import apiClient from "./ApiConfig/apiClient";

export interface LoginPayload {
    email: string;
    password: string;
}

export interface LoginResponse {
    access: string;
    refresh: string;
}

export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
}

export const login = async (data: LoginPayload) => {
  try {
    const response = await apiClient.post<any>("/auth/login/", data)
    return response.data
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Login failed"

    throw new Error(message)
  }
}


export const registerUser = async (data: RegisterPayload): Promise<any> => {
    try {
        const response = await apiClient.post<any>("/auth/register/", data);
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Registration failed");
    }   
};

export const checkAuth = async (): Promise<any> => {
    try {
        const response = await apiClient.get<any>("/auth/me");
        return response.isAuthenticated;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Authentication check failed");
    }   
};

export const logout = async (): Promise<void> => {
    try {
        await apiClient.post("/auth/logout/");
    } catch (error: any) {
        throw new Error(error.response?.data?.message || "Logout failed");
    }   
};

export const resendVerification = async (email: string): Promise<any> => {
    try {
        const response = await apiClient.post("/auth/resend-verification/", {
            email: email
        })
        return response
    } catch(error: any) {
        const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Failed Sending Verification"

    throw new Error(message)
    }
}

