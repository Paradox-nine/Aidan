import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import SelectionPanel from './components/SelectionPanel';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import { useProducts } from './hooks/useProducts';
import { useSelection } from './hooks/useSelection';
import { useAuth } from './hooks/useAuth';
import './App.css';

export default function App() {
  const { user, loginWithEmail, logout } = useAuth();
  const {
    products,
    loading: productsLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleStockStatus
  } = useProducts();

  const selectionHook = useSelection();

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isSelectionPanelOpen, setIsSelectionPanelOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleOpenDashboard = () => {
    if (user) {
      setShowDashboard(true);
    } else {
      setIsAdminModalOpen(true);
    }
  };

  const handleLogout = async () => {
    await logout();
    setShowDashboard(false);
  };

  return (
    <div className="app-layout">
      <Navbar 
        user={user} 
        selectionCount={selectionHook.totalItemsCount}
        onOpenSelection={() => setIsSelectionPanelOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenDashboard={handleOpenDashboard}
        onLogout={handleLogout}
      />

      {showDashboard && user ? (
        <main className="main-content dashboard-view">
          <AdminDashboard 
            user={user}
            products={products}
            loading={productsLoading}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
            onToggleStockStatus={toggleStockStatus}
            onClose={() => setShowDashboard(false)}
          />
        </main>
      ) : (
        <main className="main-content">
          <Hero totalProductsCount={products.length} />
          
          <ProductGrid
            products={products}
            loading={productsLoading}
            onSelectProduct={(prod, color) => selectionHook.addItem(prod, color)}
          />

          <section id="about" className="about-section">
            <div className="section-container">
              <div className="about-card">
                <h2>About Smart Catalog System</h2>
                <p>
                  Smart Catalog is a modern, mobile-responsive product management platform powered by Supabase. Browse items, build custom selections with automatic line totals and grand totals, and manage products smoothly with secure admin controls.
                </p>
                <div className="about-tags">
                  <span className="tag">#SupabaseDB</span>
                  <span className="tag">#SupabaseStorage</span>
                  <span className="tag">#ResponsiveDesign</span>
                  <span className="tag">#ProductCatalog</span>
                  <span className="tag">#AdminPortal</span>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      <SelectionPanel
        isOpen={isSelectionPanelOpen}
        onClose={() => setIsSelectionPanelOpen(false)}
        selectionHook={selectionHook}
        products={products}
      />

      <Footer 
        user={user}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenDashboard={handleOpenDashboard}
      />

      <AdminLogin 
        isOpen={isAdminModalOpen} 
        onClose={() => setIsAdminModalOpen(false)}
        onLoginSuccess={() => {
          setShowDashboard(true);
        }}
        loginWithEmail={loginWithEmail}
      />
    </div>
  );
}
