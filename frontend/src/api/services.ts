import { api } from './client';
import type { Cart, ContactMessage, DashboardData, Order, Product, User } from './types';

export const authApi = {
  login: (data: { usernameOrEmail: string; password: string }) => api.post<{ accessToken: string; user: User }>('/auth/login', data),
  register: (data: { fullName: string; username: string; email: string; password: string; phone?: string }) => api.post<{ accessToken: string; user: User }>('/auth/register', data),
  me: () => api.get<User>('/auth/me'),
};

export const productApi = {
  list: (params?: { keyword?: string; category?: string }) => api.get<Product[]>('/products', { params }),
  featured: () => api.get<Product[]>('/products/featured'),
  categories: () => api.get<string[]>('/products/categories/list'),
  detail: (id: number) => api.get<Product>(`/products/${id}`),
  create: (form: FormData) => api.post<Product>('/products', form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: number, form: FormData) => api.patch<Product>(`/products/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } }),
  remove: (id: number) => api.delete(`/products/${id}`),
};

export const cartApi = {
  get: () => api.get<Cart>('/cart'),
  add: (productId: number, quantity: number) => api.post<Cart>('/cart/add', { productId, quantity }),
  update: (productId: number, quantity: number) => api.put<Cart>('/cart/update', { productId, quantity }),
  remove: (productId: number) => api.delete<Cart>(`/cart/remove/${productId}`),
  clear: () => api.delete<Cart>('/cart/clear'),
};

export const orderApi = {
  create: (data: { fullName: string; email: string; phone: string; address: string; paymentMethod: string; note?: string }) => api.post<Order>('/orders', data),
  list: () => api.get<Order[]>('/orders'),
  detail: (id: number) => api.get<Order>(`/orders/${id}`),
  adminList: () => api.get<Order[]>('/admin/orders'),
  adminUpdateStatus: (id: number, status: Order['status']) => api.patch<Order>(`/admin/orders/${id}/status`, { status }),
  dashboard: () => api.get<DashboardData>('/admin/dashboard'),
  revenue: () => api.get<Array<{ period: string; orders: number; revenue: number }>>('/admin/revenue'),
  users: () => api.get<User[]>('/admin/users'),
};

export const contactApi = {
  create: (data: { name: string; email: string; phone?: string; message: string }) => api.post('/contact', data),
  adminList: () => api.get<ContactMessage[]>('/contact/admin'),
  read: (id: number) => api.post(`/contact/admin/${id}/read`),
  remove: (id: number) => api.delete(`/contact/admin/${id}`),
};


