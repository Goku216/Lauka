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

export const createCategory = async (data: FormData): Promise<any> => {
  try {
    const response = await apiClient.post("/categories/create/", data, {
      headers: {
        "Content-Type": "multipart/form-data", // ← explicit override
      },
    });
    return response;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.detail || "Failed to create category"
    );
  }
};

export const updateCategory = async (
  id: string,
  data: FormData
): Promise<any> => {
  try {
    const response = await apiClient.put(
      `/categories/${id}/update/`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.detail || "Failed to update category"
    );
  }
};

export const deleteCategory = async (id:string): Promise<any> => {
    try {
        const response = await apiClient.delete<any>(`/categories/${id}/delete/`)
        return response
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || "Failed to delete category")
    }

}