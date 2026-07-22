import apiClient from "./ApiConfig/apiClient";
import { WishlistResponse } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API || "http://localhost:3000/api";

// image/additional_images are now R2 object_keys (strings), not Files
export interface ProductPayload {
  name: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  in_stock: boolean;
  category: string;
  discount_price?: number;
  tags?: string[];
  image?: string; // object_key of thumbnail
  additional_images?: string[]; // object_keys, existing + newly uploaded
  is_featured?: boolean;
  is_new?: boolean;
}

export interface ProductImage {
  image_id: string;
  image: string;
}

export interface CategoryResponse {
  reference_id: string;
  name: string;
  is_active: boolean;
  slug: string;
  logo: string;
  product_count: number;
}

export interface ProductResponse {
  reference_id: string;
  name: string;
  description: string;
  price: string;
  discount_price: string;
  stock: number;
  image: string;
  unit: string;
  images: ProductImage[];
  tags: string;
  in_stock: boolean;
  category: string;
  is_featured?: boolean;
  is_new?: boolean;
  rating?: number;
  reviews?: number;
  discount_percentage?: number;
  original_price: number;
}

class ProductApi {
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<{ products: ProductResponse[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("page_size", params.limit.toString());
    if (params?.category) queryParams.append("category", params.category);
    if (params?.search) queryParams.append("search", params.search);

    const response = await fetch(`${API_BASE_URL}/products/?${queryParams}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) throw new Error("Failed to fetch products");

    const data = await response.json();
    return { products: data.results || [], total: data.count || 0 };
  }

  async getProduct(id: string): Promise<ProductResponse> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Failed to fetch product");
    return response.json();
  }

  async createProduct(data: ProductPayload): Promise<ProductResponse> {
    try {
      const payload = {
        name: data.name,
        description: data.description,
        price: data.price,
        stock: data.stock,
        in_stock: data.in_stock,
        category: data.category,
        unit: data.unit,
        ...(data.discount_price !== undefined ? { discount_price: data.discount_price } : {}),
        ...(data.tags && data.tags.length > 0 ? { tags: data.tags.join(",") } : {}),
        ...(data.image ? { image: data.image } : {}),
        ...(data.additional_images ? { additional_images: data.additional_images } : {}),
        ...(data.is_featured !== undefined ? { is_featured: data.is_featured } : {}),
        ...(data.is_new !== undefined ? { is_new: data.is_new } : {}),
      };
      const response = await apiClient.post<ProductResponse>("/products/create/", payload);
      return response as any;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to create product");
    }
  }

  async updateProduct(id: string, data: Partial<ProductPayload>): Promise<ProductResponse> {
    try {
      const payload: Record<string, any> = {};
      if (data.name !== undefined) payload.name = data.name;
      if (data.description !== undefined) payload.description = data.description;
      if (data.price !== undefined) payload.price = data.price;
      if (data.stock !== undefined) payload.stock = data.stock;
      if (data.in_stock !== undefined) payload.in_stock = data.in_stock;
      if (data.category !== undefined) payload.category = data.category;
      if (data.unit !== undefined) payload.unit = data.unit;
      if (data.discount_price !== undefined) payload.discount_price = data.discount_price;
      if (data.tags && data.tags.length > 0) payload.tags = data.tags.join(",");
      if (data.image !== undefined) payload.image = data.image;
      if (data.additional_images !== undefined) payload.additional_images = data.additional_images;
      if (data.is_featured !== undefined) payload.is_featured = data.is_featured;
      if (data.is_new !== undefined) payload.is_new = data.is_new;

      const response = await apiClient.put<ProductResponse>(`/products/${id}/update/`, payload);
      return response as any;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to update product");
    }
  }

  async deleteProduct(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/products/${id}/delete/`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    if (!response.ok) throw new Error("Failed to delete product");
  }

  async addToWishlist(id: string): Promise<any> {
    try {
      return await apiClient.post("/wishlist/add/", { product_id: id });
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || error?.response?.data?.error || "Failed to add product"
      );
    }
  }

  async removeFromWishlist(id: string): Promise<any> {
    try {
      return await apiClient.delete("/wishlist/remove/", { product_id: String(id) });
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || error?.response?.data?.error || "Failed to remove wishlist"
      );
    }
  }

  async getWishlist(): Promise<any> {
    try {
      return await apiClient.get<WishlistResponse>("/wishlist/");
    } catch (error: any) {
      throw new Error(
        error?.response?.data?.message || error?.response?.data?.error || "Failed to fetch wishlist"
      );
    }
  }
}

export const productApi = new ProductApi();