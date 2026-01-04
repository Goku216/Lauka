import apiClient from "./ApiConfig/apiClient"
import { CategoryResponse } from "./productApi";



export const getCategories = async (): Promise<{ categories: CategoryResponse[] }> => {
    try {
        const response = await apiClient.get<any>(`/categories/`);
       
         return {
      categories: response || [],
    
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