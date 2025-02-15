import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // User is not authenticated
    return <Navigate to="/login" replace />;
  }

  // If there are children, render them, otherwise render the Outlet
  return children ? children : <Outlet />;
};

export default ProtectedRoute;