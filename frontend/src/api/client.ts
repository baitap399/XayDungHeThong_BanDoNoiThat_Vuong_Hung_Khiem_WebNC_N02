// file cấu hình client gọi api từ frontend tới backend và xử lý request chung.
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
export const API_ORIGIN = API_BASE.replace(/\/api\/?$/, '');

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('giadung_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function imageUrl(value?: string | null) {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('/')) return `${API_ORIGIN}${value}`;
  return value;
}

export function formatVnd(value: number) {
  return new Intl.NumberFormat('vi-VN').format(value) + '₫';
}
