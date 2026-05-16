import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/store/AuthContext';
import { Spinner } from './ui/Spinner';

export function GuestRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
