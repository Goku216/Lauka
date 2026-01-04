// Type definitions for product management

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  is_available: boolean;
  category: string; // UUID reference to category
  sku: string;
  discount_price: number;
  tags: string; // Comma-separated string
  thumbnail: string; // URL or path
  additional_images: string; // Comma-separated URLs or paths
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parent_id?: string;
  is_active: boolean;
  createdAt: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  is_available?: boolean;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Categories {
    reference_id: string;
    name: string;
    is_active: boolean;
    icon: string;
    slug: string;
}