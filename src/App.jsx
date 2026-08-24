import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import ProductGrid from './components/ProductGrid';
import SelectionPanel from './components/SelectionPanel';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';

import { useProducts } from './hooks/useProducts';
import { useAuth } from './hooks/useAuth';
import { useSelection } from './hooks/useSelection';

import './App.css';

export default function App() {
  const { user, loginWithEmail, logout } = useAuth();
  const {
    products,
    loading: productsLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleStock
  } = useProducts();

  const {
    selectedItems,
    addItem,
    updateQuantity,
    updateColor,
    removeItem,
    clearSelection,
    totalItemCount
  } = useSelection();

  // Navigation & UI States
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [isSelectionOpen, setIsSelectionOpen] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBrand, setSelectedBrand] = useState('All');

  // Dynamic filter values derived from products data
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean));
    return Array.from(set);
  }, [products]);

  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand).filter(Boolean));
    return Array.from(set);
  }, [products]);

  // Filtered products list for public dashboard
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.note && product.note.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesBrand = selectedBrand === 'All' || product.brand === selectedBrand;

      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [products, searchQuery, selectedCategory, selectedBrand]);

  const handleAdminLoginSubmit = async (email, password) => {
    await loginWithEmail(email, password);
    setShowDashboard(true);
  };

  const handleLogout = async () => {
    await logout();
    setShowDashboard(false);
  };

  return (
    <div className="app-layout">
      <Navbar
        user={user}
        selectionCount={totalItemCount}
        onOpenSelection={() => setIsSelectionOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenDashboard={() => setShowDashboard(true)}
        onLogout={handleLogout}
      />

      {showDashboard && user ? (
        <main className="main-content dashboard-view">
          <AdminDashboard
            user={user}
            products={products}
            onAddProduct={addProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
            onToggleStock={toggleStock}
            onClose={() => setShowDashboard(false)}
          />
        </main>
      ) : (
        <main className="main-content">
          <Hero />

          <section id="catalog" className="catalog-section">
            <div className="section-container">
              <div className="section-header">
                <h2 className="section-title">Product Catalog</h2>
                <p className="section-subtitle">
                  Browse items, explore color variants, and build your custom selection list.
                </p>
              </div>

              <div className="catalog-controls">
                <SearchBar
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />

                <FilterBar
                  categories={categories}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  brands={brands}
                  selectedBrand={selectedBrand}
                  setSelectedBrand={setSelectedBrand}
                />
              </div>

              <ProductGrid
                products={filteredProducts}
                loading={productsLoading}
                onSelectProduct={addItem}
              />
            </div>
          </section>
        </main>
      )}

      {/* Product Selection Drawer/Panel */}
      <SelectionPanel
        selectedItems={selectedItems}
        onUpdateQuantity={updateQuantity}
        onUpdateColor={updateColor}
        onRemove={removeItem}
        onClear={clearSelection}
        isOpen={isSelectionOpen}
        onClose={() => setIsSelectionOpen(false)}
      />

      {/* Admin Authentication Modal */}
      <AdminLogin
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        onLogin={handleAdminLoginSubmit}
      />

      <Footer
        user={user}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenDashboard={() => setShowDashboard(true)}
      />
    </div>
  );
}
