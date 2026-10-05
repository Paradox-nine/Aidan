import React, { useState, useEffect } from 'react';
import Catalog from './components/Catalog';
import AdminRoute from './components/AdminRoute';
import CeitAiAssistant from './components/CeitAiAssistant';

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPopState = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  if (currentPath === '/admin') {
    return <AdminRoute onNavigate={navigate} currentPath={currentPath} />;
  }

  if (currentPath === '/ai') {
    return <CeitAiAssistant onNavigate={navigate} currentPath={currentPath} />;
  }

  return <Catalog onNavigate={navigate} currentPath={currentPath} />;
}
