import React from 'react';
import { authService } from '../../services/authService';
import AdminLogin from './AdminLogin';

export default function AdminProtectedRoute({ children }) {
  const isAuth = authService.isAuthenticated();

  if (!isAuth) {
    return (
      <AdminLogin
        onLoginSuccess={() => {
          window.location.reload();
        }}
      />
    );
  }

  return <>{children}</>;
}
