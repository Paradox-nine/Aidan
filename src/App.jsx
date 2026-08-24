import React, { useState, useEffect } from 'react';
import Catalog from './components/Catalog';
import AdminRoute from './components/AdminRoute';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    return path === '/admin' || hash === '#/admin' || hash === '#admin' ? '/admin' : '/';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || hash === '#/admin' || hash === '#admin') {
        setCurrentRoute('/admin');
      } else {
        setCurrentRoute('/');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  if (currentRoute === '/admin') {
    return <AdminRoute />;
  }

  return <Catalog />;
}
