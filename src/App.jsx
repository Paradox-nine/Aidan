import React, { useState, useEffect } from 'react';
import Catalog from './components/Catalog';
import AdminRoute from './components/AdminRoute';
import EventsList from './components/EventsList';
import EventDetail from './components/EventDetail';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Route matching logic
  if (currentPath === '/admin') {
    return <AdminRoute onNavigate={navigate} />;
  }

  if (currentPath === '/events' || currentPath === '/events/') {
    return <EventsList onNavigate={navigate} />;
  }

  if (currentPath.startsWith('/events/')) {
    const slug = currentPath.replace('/events/', '').split('/')[0];
    if (slug) {
      return <EventDetail slug={slug} onNavigate={navigate} />;
    }
  }

  return <Catalog onNavigate={navigate} />;
}
