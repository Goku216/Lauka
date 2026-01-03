// API service for product operations
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API || 'http://localhost:3000/api';

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  stock: number;
  is_available: boolean;
  category: string; // UUID reference_id of category
  sku: string;
  discount_price?: number;
  tags?: string[]; // Will be converted to comma-separated string for backend
  thumbnail?: File;
  additional_images?: File[]; // Will be sent as 'images' to backend
}

export interface ProductImage {
  image_id: string;
  image: string;
}

export interface CategoryResponse {
  reference_id: string;
  name: string;
  is_active: boolean;
}

export interface ProductResponse {
  reference_id: string;
  sku: string;
  name: string;
  description: string;
  price: string;
  discount_price: string;
  stock: number;
  thumbnail: string;
  images: ProductImage[];
  tags: string;
  is_available: boolean;
  category: CategoryResponse;
}

class ProductApi {
  // Get all products with optional pagination and filters
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<{ products: ProductResponse[]; total: number }> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('page_size', params.limit.toString()); // Changed from 'limit' to 'page_size'
    if (params?.category) queryParams.append('category', params.category);
    if (params?.search) queryParams.append('search', params.search);

    const response = await fetch(`${API_BASE_URL}/products?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    
    // Transform Django REST Framework response format
    return {
      products: data.results || [],
      total: data.count || 0,
    };
  }

  // Get single product by ID
  async getProduct(id: string): Promise<ProductResponse> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    return response.json();
  }

  // Create new product
  async createProduct(data: ProductFormData): Promise<ProductResponse> {
    const formData = new FormData();
    
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price.toString());
    formData.append('stock', data.stock.toString());
    formData.append('is_available', data.is_available.toString());
    formData.append('category', data.category);
    formData.append('sku', data.sku);
    
    if (data.discount_price !== undefined) {
      formData.append('discount_price', data.discount_price.toString());
    }
    
    if (data.tags && data.tags.length > 0) {
      formData.append('tags', data.tags.join(','));
    }
    
    if (data.thumbnail) {
      formData.append('thumbnail', data.thumbnail);
    }
    
    // Send as 'images' instead of 'additional_images'
    if (data.additional_images && data.additional_images.length > 0) {
      data.additional_images.forEach((file) => {
        formData.append('images', file);
      });
    }

    const response = await fetch(`${API_BASE_URL}/products/create/`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create product');
    }

    return response.json();
  }

  // Update existing product
  async updateProduct(id: string, data: Partial<ProductFormData>): Promise<ProductResponse> {
    const formData = new FormData();
    
    if (data.name) formData.append('name', data.name);
    if (data.description) formData.append('description', data.description);
    if (data.price !== undefined) formData.append('price', data.price.toString());
    if (data.stock !== undefined) formData.append('stock', data.stock.toString());
    if (data.is_available !== undefined) formData.append('is_available', data.is_available.toString());
    if (data.category) formData.append('category', data.category);
    if (data.sku) formData.append('sku', data.sku);
    if (data.discount_price !== undefined) formData.append('discount_price', data.discount_price.toString());
    
    if (data.tags && data.tags.length > 0) {
      formData.append('tags', data.tags.join(','));
    }
    
    if (data.thumbnail) {
      formData.append('thumbnail', data.thumbnail);
    }
    
    // Send as 'images' instead of 'additional_images'
    if (data.additional_images && data.additional_images.length > 0) {
      data.additional_images.forEach((file) => {
        formData.append('images', file);
      });
    }

    const response = await fetch(`${API_BASE_URL}/products/${id}/update/`, {
      method: 'PUT',
      body: formData,
    credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update product');
    }

    return response.json();
  }

  // Delete product
  async deleteProduct(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }
  }
}

export const productApi = new ProductApi();