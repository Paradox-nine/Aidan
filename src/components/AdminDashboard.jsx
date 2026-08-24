import React, { useState } from 'react';
import ProductForm from './ProductForm';
import { 
  Package,
  Layers,
  CheckCircle2, 
  XCircle,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  X,
  ShieldAlert,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';
import { formatPrice } from '../utils/priceFormatter';

export default function AdminDashboard({
  user,
  products = [],
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onToggleStock,
  onClose
}) {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'add' | 'edit'
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Delete modal state
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Calculated Stats
  const totalProducts = products.length;
  const categoriesList = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
  const brandsList = Array.from(new Set(products.map((p) => p.brand).filter(Boolean)));
  const totalCategories = categoriesList.length;
  const totalBrands = brandsList.length;
  const inStockCount = products.filter((p) => p.in_stock !== false && p.inStock !== false).length;
  const outOfStockCount = totalProducts - inStockCount;

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateSubmit = async (productData, imageFile) => {
    setLoading(true);
    setFeedback({ type: '', message: '' });
    try {
      await onAddProduct(productData, imageFile);
      setFeedback({ type: 'success', message: 'Product created successfully!' });
      setActiveTab('list');
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to create product.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (productData, imageFile) => {
    if (!editingProduct) return;
    setLoading(true);
    setFeedback({ type: '', message: '' });
    try {
      await onUpdateProduct(editingProduct.id, productData, imageFile);
      setFeedback({ type: 'success', message: 'Product updated successfully!' });
      setEditingProduct(null);
      setActiveTab('list');
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update product.' });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmId) return;
    const prodToDelete = products.find((p) => p.id === deleteConfirmId);
    setLoading(true);
    try {
      await onDeleteProduct(deleteConfirmId, prodToDelete?.image_url);
      setFeedback({ type: 'success', message: 'Product deleted successfully.' });
    } catch (err) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete product.' });
    } finally {
      setDeleteConfirmId(null);
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>Smart Catalog Admin Dashboard</h2>
          <p className="dashboard-welcome">
            Logged in as <span className="highlight-user">{user?.email || 'Admin'}</span>
          </p>
        </div>
        <button onClick={onClose} className="btn btn-outline btn-sm">
          <X size={18} /> Close Dashboard
        </button>
      </div>

      {!isSupabaseConfigured && (
        <div className="demo-notice banner-info">
          <ShieldAlert size={18} />
          <div>
            <strong>Demo Storage & Database:</strong> Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> in <code>.env</code> to persist directly to Supabase table & bucket. Currently running local demo mode.
          </div>
        </div>
      )}

      {feedback.message && (
        <div className={`alert-banner alert-${feedback.type}`}>
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Overview Stats Cards */}
      <div className="stats-grid">
        <div className="stat-overview-card">
          <Package className="stat-overview-icon" size={24} />
          <div className="stat-overview-info">
            <span className="stat-overview-value">{totalProducts}</span>
            <span className="stat-overview-label">Total Products</span>
          </div>
        </div>

        <div className="stat-overview-card">
          <Layers className="stat-overview-icon" size={24} />
          <div className="stat-overview-info">
            <span className="stat-overview-value">{totalCategories}</span>
            <span className="stat-overview-label">Categories</span>
          </div>
        </div>

        <div className="stat-overview-card">
          <Layers className="stat-overview-icon" size={24} />
          <div className="stat-overview-info">
            <span className="stat-overview-value">{totalBrands}</span>
            <span className="stat-overview-label">Brands</span>
          </div>
        </div>

        <div className="stat-overview-card success-stat">
          <CheckCircle2 className="stat-overview-icon" size={24} />
          <div className="stat-overview-info">
            <span className="stat-overview-value">{inStockCount}</span>
            <span className="stat-overview-label">In Stock</span>
          </div>
        </div>

        <div className="stat-overview-card warning-stat">
          <XCircle className="stat-overview-icon" size={24} />
          <div className="stat-overview-info">
            <span className="stat-overview-value">{outOfStockCount}</span>
            <span className="stat-overview-label">Out of Stock</span>
          </div>
        </div>
      </div>

      {/* Dashboard Sub-Header & Controls */}
      <div className="dashboard-nav-bar">
        <div className="nav-tabs">
          <button
            className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => { setActiveTab('list'); setEditingProduct(null); }}
          >
            All Products
          </button>
          <button
            className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => { setActiveTab('add'); setEditingProduct(null); }}
          >
            <Plus size={16} /> Add New Product
          </button>
          {activeTab === 'edit' && (
            <button className="tab-btn active">
              <Edit size={16} /> Edit Product
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="dashboard-content">
        {activeTab === 'add' && (
          <div className="dashboard-card">
            <h3>Add New Product</h3>
            <ProductForm
              onSubmit={handleCreateSubmit}
              onCancel={() => setActiveTab('list')}
              loading={loading}
            />
          </div>
        )}

        {activeTab === 'edit' && editingProduct && (
          <div className="dashboard-card">
            <h3>Edit Product: {editingProduct.name}</h3>
            <ProductForm
              initialProduct={editingProduct}
              onSubmit={handleEditSubmit}
              onCancel={() => { setEditingProduct(null); setActiveTab('list'); }}
              loading={loading}
            />
          </div>
        )}

        {activeTab === 'list' && (
          <div className="dashboard-card">
            <div className="admin-table-filters">
              <div className="search-input-wrapper">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Filter by name or brand..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="category-filter-wrapper">
                <Filter size={16} />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  {categoriesList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Stock Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        No products found matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => {
                      const img = p.image_url || p.image || p.imageUrl;
                      const inStk = p.in_stock !== undefined ? p.in_stock : (p.inStock ?? true);

                      return (
                        <tr key={p.id}>
                          <td>
                            <div className="table-product-cell">
                              <img src={img} alt={p.name} className="table-thumb" />
                              <div className="cell-info">
                                <span className="cell-title">{p.name}</span>
                                {p.tag && <span className="cell-tag">{p.tag}</span>}
                              </div>
                            </div>
                          </td>
                          <td>{p.category || '-'}</td>
                          <td>{p.brand || '-'}</td>
                          <td>{formatPrice(p.price, p.currency)}</td>
                          <td>
                            <button
                              type="button"
                              className={`stock-toggle-btn ${inStk ? 'in-stock' : 'out-stock'}`}
                              onClick={() => onToggleStock(p.id, inStk)}
                              title="Click to toggle stock status"
                            >
                              {inStk ? (
                                <>
                                  <ToggleRight size={20} /> In Stock
                                </>
                              ) : (
                                <>
                                  <ToggleLeft size={20} /> Out of Stock
                                </>
                              )}
                            </button>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button
                                type="button"
                                className="action-btn edit-btn"
                                onClick={() => {
                                  setEditingProduct(p);
                                  setActiveTab('edit');
                                }}
                                title="Edit product"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                type="button"
                                className="action-btn delete-btn"
                                onClick={() => setDeleteConfirmId(p.id)}
                                title="Delete product"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="modal-card confirmation-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Deletion</h3>
              <button onClick={() => setDeleteConfirmId(null)} className="modal-close-btn">
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this product? This action cannot be undone.</p>
              <div className="modal-actions">
                <button
                  className="btn btn-outline"
                  onClick={() => setDeleteConfirmId(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger"
                  onClick={confirmDelete}
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Yes, Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
