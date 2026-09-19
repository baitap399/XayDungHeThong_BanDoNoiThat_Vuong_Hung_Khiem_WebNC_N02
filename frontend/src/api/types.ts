
export interface DashboardData {
  revenue: number;
  orders: number;
  pendingOrders: number;
  users: number;
  products: number;
  recentOrders: Order[];
  chartRevenueByDay: Array<{ day: string; value: number }>;
  chartOrdersByDay: Array<{ day: string; value: number }>;
}
export type Role = 'USER' | 'ADMIN';

export interface User {
  id: number;
  fullName: string;
  username: string | null;
  email: string;
  phone: string | null;
  role: Role;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  specifications: string | null;
  origin: string | null;
  price: number;
  stock: number;
  category: string | null;
  brand: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  subtotal: number;
  product: Pick<Product, 'id' | 'name' | 'price' | 'stock' | 'imageUrl' | 'category' | 'brand'>;
}

export interface Cart {
  id: number;
  items: CartItem[];
  itemCount: number;
  total: number;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'DELIVERED' | 'CANCELLED';
export type PaymentMethod = 'QR' | 'CARD' | 'CASH';

export interface OrderItem {
  id: number;
  productId: number | null;
  productName: string;
  productImage: string | null;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: number;
  userId: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'UNPAID' | 'PAID';
  note: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}
