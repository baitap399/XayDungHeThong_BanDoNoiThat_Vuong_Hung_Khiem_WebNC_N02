// file là component react dùng để tái sử dụng phần giao diện hoặc logic liên quan.
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ role }: { role?: 'USER' | 'ADMIN' }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="loading-page">Đang tải...</div>;
  if (!user) return <Navigate to={role === 'ADMIN' ? '/admin/login' : '/login'} replace state={{ from: location }} />;
  // Keep admin URLs in the admin flow after a refresh. Redirecting an
  // authenticated non-admin to `/` makes the storefront appear unexpectedly.
  if (role && user.role !== role) {
    return <Navigate to={role === 'ADMIN' ? '/admin/login' : '/'} replace />;
  }
  return <Outlet />;
}
