import React, { useState, useEffect } from 'react';
import Catalog from './components/Catalog';
import AdminLogin from './components/admin/AdminLogin';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminEventsDashboard from './components/admin/AdminEventsDashboard';
import EventForm from './components/admin/EventForm';
import PublicEventsPage from './components/PublicEventsPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // /admin/login
  if (currentPath === '/admin/login') {
    return (
      <AdminLogin
        onLoginSuccess={() => {
          window.location.href = '/admin/events';
        }}
      />
    );
  }

  // /admin/events/new
  if (currentPath === '/admin/events/new') {
    return (
      <AdminProtectedRoute>
        <AdminLayout activeTab="events">
          <EventForm />
        </AdminLayout>
      </AdminProtectedRoute>
    );
  }

  // /admin/events/:id/edit
  const editMatch = currentPath.match(/^\/admin\/events\/([^/]+)\/edit$/);
  if (editMatch) {
    const eventId = editMatch[1];
    return (
      <AdminProtectedRoute>
        <AdminLayout activeTab="events">
          <EventForm eventId={eventId} />
        </AdminLayout>
      </AdminProtectedRoute>
    );
  }

  // /admin or /admin/events
  if (currentPath === '/admin' || currentPath === '/admin/events') {
    return (
      <AdminProtectedRoute>
        <AdminLayout activeTab="events">
          <AdminEventsDashboard />
        </AdminLayout>
      </AdminProtectedRoute>
    );
  }

  // /events (Public Events Page)
  if (currentPath === '/events') {
    return <PublicEventsPage />;
  }

  // Default Home / Catalog
  return <Catalog />;
}
