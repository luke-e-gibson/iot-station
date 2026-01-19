import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext';

export function ProtectedRoute() {
  const { isAuthenticated, isHydrated } = useAuth();

  // Wait for hydration to complete before making auth decisions
  if (!isHydrated) {
    return <Outlet />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { isAuthenticated, isHydrated } = useAuth();

  // Wait for hydration to complete before making auth decisions
  if (!isHydrated) {
    return <Outlet />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
