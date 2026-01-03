import apiClient from "./ApiConfig/apiClient"



export const getCategories = async (): Promise<any> => {
    try {
        const response = await apiClient.get<any>("/categories/");
        console.log('Categories response:', response.results);
        return response.results;
    } catch (error: any) {
        throw new Error(error.response?.data?.detail || "Failed to fetch categories");
    }
}