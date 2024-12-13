// frontend/src/components/auth/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  // TODO: Implement actual auth check
  const isAuthenticated = true; // Temporary, will implement proper auth check later

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;