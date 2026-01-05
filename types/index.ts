import { ProductImage } from "@/service/productApi";

export interface Product {
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
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  slug: string;
  productCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CheckoutForm {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  district: string;
  city: string;
  notes?: string;
}

export const LUMBINI_DISTRICTS = [
  'Kapilvastu',
  'Parasi',
  'Rupandehi',
  'Palpa',
  'Arghakhanchi',
  'Gulmi',
  'Pyuthan',
  'Rolpa',
  'Rukum (East)',
  'Dang',
  'Banke',
  'Bardiya',
] as const;

export type LumbiniDistrict = typeof LUMBINI_DISTRICTS[number];

// Order types
export type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface OrderItem {
  reference_id: string;
  product: number;
  product_name: string;
  quantity: number;
  price: string;
}

export interface OrderUserProfile {
  reference_id: string;
  profile_picture: string | null;
  gender: string;
  city: string;
  country: string;
  occupation: string;
  company: string;
  about_me: string;
  language: string;
  timezone: string;
  profile_completion_percentage: number;
}

export interface OrderUser {
  reference_id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number: string | null;
  bio: string;
  is_active: boolean;
  is_admin: boolean;
  is_banned: boolean;
  is_verified: boolean;
  two_fa_enabled: boolean;
  profile: OrderUserProfile;
  date_joined: string;
}

export interface Order {
  order_id: string;
  total_price: string;
  status: OrderStatus;
  shipping_address: string;
  order_code: string;
  phone_number: string;
  full_name: string;
  email: string;
  district: string;
  city: string;
  order_notes: string;
  items: OrderItem[];
  user: OrderUser;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export type OrdersResponse = PaginatedResponse<Order>;



// Users Types
export interface UserProfile {
  reference_id: string;
  profile_picture: string | null;
  gender: string;
  city: string;
  country: string;
  occupation: string;
  company: string;
  about_me: string;
  language: string;
  timezone: string;
  profile_completion_percentage: number;
}

export interface User {
  reference_id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number: string | null;
  bio: string;
  is_active: boolean;
  is_admin: boolean;
  is_banned: boolean;
  is_verified: boolean;
  two_fa_enabled: boolean;
  profile: UserProfile;
  date_joined: string; // ISO date string
}

export type UsersResponse = PaginatedResponse<User>;


export interface Profile {
  reference_id: string;
  email: string;
  username: string;
  phone_number: string;
  bio: string;
  is_active: boolean;
  is_verified: boolean;
  date_joined: string;

}






