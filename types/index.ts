export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  category: string;
  unit: string;
  inStock: boolean;
  rating: number;
  reviews: number;
  isNew?: boolean;
  isFeatured?: boolean;
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
  email: string;
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



