import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppStore } from '../store/AppStore';

export function AuthGate() {
  const { user } = useAppStore();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}