// Core type definitions for the admin dashboard

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'banned';
  avatar?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  status: 'active' | 'draft' | 'archived';
  createdAt: string;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  productCount: number;
  createdAt: string;
}

export interface SalesData {
  date: string;
  sales: number;
  orders: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
  totalSales: number;
  salesGrowth: number;
  userGrowth: number;
}

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}
