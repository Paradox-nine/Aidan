import React from 'react';
import Catalog from './components/Catalog';
import AdminRoute from './components/AdminRoute';

export default function App() {
  const path = window.location.pathname;

  if (path === '/admin') {
    return <AdminRoute />;
  }

  return <Catalog />;
}
