import { User, Product, Category, SalesData, DashboardStats } from '@/types/AdminPageTypes';

// Mock Users
export const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active', createdAt: '2024-01-15' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active', createdAt: '2024-02-20' },
  { id: '3', name: 'Bob Wilson', email: 'bob@example.com', role: 'moderator', status: 'active', createdAt: '2024-03-10' },
  { id: '4', name: 'Alice Brown', email: 'alice@example.com', role: 'user', status: 'banned', createdAt: '2024-03-15' },
  { id: '5', name: 'Charlie Davis', email: 'charlie@example.com', role: 'user', status: 'active', createdAt: '2024-04-01' },
  { id: '6', name: 'Eva Martinez', email: 'eva@example.com', role: 'user', status: 'active', createdAt: '2024-04-15' },
  { id: '7', name: 'Frank Lee', email: 'frank@example.com', role: 'moderator', status: 'active', createdAt: '2024-05-01' },
  { id: '8', name: 'Grace Kim', email: 'grace@example.com', role: 'user', status: 'banned', createdAt: '2024-05-10' },
];

// Mock Products
export const mockProducts: Product[] = [
  { id: '1', name: 'Wireless Headphones', price: 149.99, category: 'Electronics', stock: 45, status: 'active', createdAt: '2024-01-10' },
  { id: '2', name: 'Smart Watch Pro', price: 299.99, category: 'Electronics', stock: 23, status: 'active', createdAt: '2024-01-15' },
  { id: '3', name: 'Ergonomic Chair', price: 449.99, category: 'Furniture', stock: 12, status: 'active', createdAt: '2024-02-01' },
  { id: '4', name: 'Standing Desk', price: 599.99, category: 'Furniture', stock: 8, status: 'draft', createdAt: '2024-02-15' },
  { id: '5', name: 'Mechanical Keyboard', price: 179.99, category: 'Electronics', stock: 67, status: 'active', createdAt: '2024-03-01' },
  { id: '6', name: 'USB-C Hub', price: 79.99, category: 'Accessories', stock: 120, status: 'active', createdAt: '2024-03-10' },
  { id: '7', name: 'Monitor Light Bar', price: 89.99, category: 'Accessories', stock: 34, status: 'active', createdAt: '2024-03-20' },
  { id: '8', name: 'Webcam 4K', price: 199.99, category: 'Electronics', stock: 0, status: 'archived', createdAt: '2024-04-01' },
];

// Mock Categories
export const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', description: 'Electronic devices and gadgets', productCount: 4, createdAt: '2024-01-01' },
  { id: '2', name: 'Furniture', description: 'Office and home furniture', productCount: 2, createdAt: '2024-01-05' },
  { id: '3', name: 'Accessories', description: 'Computer and desk accessories', productCount: 2, createdAt: '2024-01-10' },
  { id: '4', name: 'Software', description: 'Digital software and licenses', productCount: 0, createdAt: '2024-02-01' },
];

// Mock Sales Data (last 7 days)
export const mockSalesData: SalesData[] = [
  { date: 'Mon', sales: 4200, orders: 28 },
  { date: 'Tue', sales: 3800, orders: 24 },
  { date: 'Wed', sales: 5100, orders: 35 },
  { date: 'Thu', sales: 4600, orders: 31 },
  { date: 'Fri', sales: 6200, orders: 42 },
  { date: 'Sat', sales: 5800, orders: 38 },
  { date: 'Sun', sales: 4900, orders: 32 },
];

// Products per category for chart
export const productsByCategory = [
  { name: 'Electronics', value: 4, fill: 'hsl(226, 70%, 55%)' },
  { name: 'Furniture', value: 2, fill: 'hsl(250, 70%, 60%)' },
  { name: 'Accessories', value: 2, fill: 'hsl(280, 60%, 55%)' },
  { name: 'Software', value: 0, fill: 'hsl(200, 70%, 50%)' },
];

// Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalUsers: 8,
  totalProducts: 8,
  totalCategories: 4,
  totalSales: 34600,
  salesGrowth: 12.5,
  userGrowth: 8.3,
};
