import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/context/AdminAuthContext';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
  try {
    const { isAuthenticated } = useAdminAuth();
    
    if (!isAuthenticated) {
      return <Navigate to="/admin/login" replace />;
    }
    
    return <>{children}</>;
  } catch (error) {
    console.error('ProtectedAdminRoute 에러:', error);
    return <Navigate to="/admin/login" replace />;
  }
};

export default ProtectedAdminRoute;

