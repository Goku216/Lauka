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



