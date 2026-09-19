import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute({ role }: { role?: 'USER' | 'ADMIN' }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="loading-page">Đang tải...</div>;
  if (!user) return <Navigate to={role === 'ADMIN' ? '/admin/login' : '/login'} replace state={{ from: location }} />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return <Outlet />;
}
