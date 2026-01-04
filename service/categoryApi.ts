import apiClient from "./ApiConfig/apiClient"
import { CategoryResponse } from "./productApi";



export const getCategories = async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<{ categories: CategoryResponse[]; total: number }> => {
     const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('page_size', params.limit.toString()); // Changed from 'limit' to 'page_size'
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);
    try {
        const response = await apiClient.get<any>(`/categories/?${queryParams}`);
        console.log('Categories response:', response.results);
         return {
      categories: response.results || [],
      total: response.count || 0,
    };
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || "Failed to fetch categories");
    }
}

export const createCategory = async (data: { name: string; icon: string; isActive: boolean }): Promise<any> => {
    try {
        const response = await apiClient.post<any>("/categories/create/", {
            name: data.name,
            icon: data.icon,
            is_active: data.isActive,
        });
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || "Failed to create category");
    }       
}

export const updateCategory = async (id: string, data: { name: string; icon: string; isActive: boolean }): Promise<any> => {
    try {
        const response = await apiClient.put<any>(`/categories/${id}/update/`, {
            name: data.name,
            icon: data.icon,
            is_active: data.isActive,
        });
        return response;
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || "Failed to update category");
    }   
}

export const deleteCategory = async (id:string): Promise<any> => {
    try {
        const response = await apiClient.delete<any>(`/categories/${id}/delete/`)
        return response
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || "Failed to delete category")
    }

}