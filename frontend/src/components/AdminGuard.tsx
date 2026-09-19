import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function AdminGuard() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-page">Đang tải...</div>;
  return user?.role === 'ADMIN' ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
