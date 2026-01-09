import { DashboardResponse, Profile, UsersResponse } from "@/types";
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

export interface changeUserPasswordPayload {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ResetPasswordPayload {
  email: string;
  new_password: string;
  confirm_password: string;
}

export interface VerifyOTPPayload {
  email: string;
  otp: string;
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
        return response;
    } catch (error: any) {
        const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Failed to fetch orders";

    throw new Error(message);
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

export const getProfile = async (): Promise<Profile> => {
  try {
    const response = await apiClient.get<any>("/auth/profile/")
    return response
  }
  catch(error: any) {
        const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Failed Sending Verification"

    throw new Error(message)
  }
}

export const getAdminStats = async (): Promise<DashboardResponse> => {
  try {
    const response = await apiClient.get<DashboardResponse>("/admin/dashboard/")
    return response
    
  }
   catch(error: any) {
        const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Failed Sending Verification"

    throw new Error(message)
  }
}


export const getAllUsers = async (params?: {
  page?: number;
  limit?: number;
}): Promise<UsersResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.limit) queryParams.append("page_size", params.limit.toString());

  try {
    const response = await apiClient.get<UsersResponse>(
      `/admin/users?${queryParams.toString()}`
    );
    return response;
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Failed to fetch orders";

    throw new Error(message);
  }
};


export const banUser = async (id:string): Promise<any> => {
  try {
    const response = await apiClient.post(`/admin/users/${id}/ban/`)
    return response
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Failed to fetch orders";

    throw new Error(message);
  }
};

export const unbanUser = async (id:string): Promise<any> => {
  try {
    const response = await apiClient.post(`/admin/users/${id}/unban/`)
    return response
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Failed to fetch orders";

    throw new Error(message);
  }
};

export const changeUserPassword = async (data: changeUserPasswordPayload): Promise<any> => {
  try {
    const response = await apiClient.post("/auth/change-password/", data)
    return response
  } catch(error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Failed to fetch orders";

    throw new Error(message);
  }
}


export const forgotPassword = async (email: string): Promise<any> => {
  try {
    const response = await apiClient.post("/auth/forgot-password/", {
      email: email
    })
    return response
  }
  catch(error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Failed to fetch orders";

    throw new Error(message);
  }
}

export const resendOTP = async (email: string): Promise<any> => {
   try {
    const response = await apiClient.post("/auth/forgot-password/resend-otp/", {
      email: email
    })
    return response
  }
  catch(error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Failed to fetch orders";

    throw new Error(message);
  }
  
}

export const verifyOTP = async (data: VerifyOTPPayload): Promise<any> => {
   try {
    const response = await apiClient.post("/auth/forgot-password/verify-otp/", data)
    return response
  }
  catch(error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Failed to fetch orders";

    throw new Error(message);
  }
  
}


export const resetPassword = async (data: ResetPasswordPayload): Promise<any> => {
   try {
    const response = await apiClient.post("/auth/forgot-password/reset-password/", data)
    return response
  }
  catch(error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Failed to fetch orders";

    throw new Error(message);
  }
  
}

