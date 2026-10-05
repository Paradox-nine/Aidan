import React from 'react';
import Catalog from './components/Catalog';
import AdminRoute from './components/AdminRoute';
import CeitAiAssistant from './components/CeitAiAssistant';

export default function App() {
  const path = window.location.pathname;

  if (path === '/admin') {
    return <AdminRoute />;
  }

  if (path === '/ai') {
    return <CeitAiAssistant />;
  }

  return <Catalog />;
}
