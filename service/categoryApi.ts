import apiClient from "./ApiConfig/apiClient";
import { CategoryResponse } from "./productApi";
export { generateUploadUrl, uploadFileToR2 } from "./uploadApi";

interface CategoryPayload {
  name: string;
  is_active: boolean;
  logo?: string;
}

export const getCategories = async (): Promise<{ categories: CategoryResponse[] }> => {
  try {
    const response = await apiClient.get<any>(`/categories/`);
    return { categories: response || [] };
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Failed to fetch categories");
  }
};

export const createCategory = async (data: CategoryPayload): Promise<any> => {
  try {
    return await apiClient.post("/categories/create/", data);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create category");
  }
};

export const updateCategory = async (id: string, data: CategoryPayload): Promise<any> => {
  try {
    return await apiClient.put(`/categories/${id}/update/`, data);
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Failed to update category");
  }
};

export const deleteCategory = async (id: string): Promise<any> => {
  try {
    return await apiClient.delete<any>(`/categories/${id}/delete/`);
  } catch (error: any) {
    throw new Error(error.response?.data?.detail || "Failed to delete category");
  }
};