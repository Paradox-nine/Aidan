import React, { useState, useMemo } from 'react';
import ProductForm from './ProductForm';
import { isSupabaseConfigured } from '../lib/supabase';
import { 
  Package,
  Layers,
  Tag,
  CheckCircle2,
  XCircle,
  PlusCircle, 
  Edit,
  Trash2, 
  Search,
  ShieldAlert,
  X,
  AlertTriangle,
  Check,
  RefreshCw
} from 'lucide-react';

export default function AdminDashboard({
  user,
  products = [],
  loading = false,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onToggleStockStatus,
  onClose
}) {
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Calculate statistics overview
  const stats = useMemo(() => {
    const total = products.length;
    const categoriesSet = new Set(products.map((p) => p.category).filter(Boolean));
    const brandsSet = new Set(products.map((p) => p.brand).filter(Boolean));
    const inStockCount = products.filter((p) => p.in_stock).length;
    const outOfStockCount = total - inStockCount;

    return {
      total,
      categoriesCount: categoriesSet.size,
      brandsCount: brandsSet.size,
      inStockCount,
      outOfStockCount,
      categoriesList: Array.from(categoriesSet).sort()
    };
  }, [products]);

  // Filter products for admin table
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name?.toLowerCase().includes(q);
        const matchesBrand = p.brand?.toLowerCase().includes(q);
        const matchesCategory = p.category?.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesCategory) return false;
      }
      if (selectedCategory && p.category !== selectedCategory) return false;
      return true;
    });
  }, [products, searchQuery, selectedCategory]);

  const handleCreateSubmit = async (productPayload, imageFile) => {
    try {
      await onAddProduct(productPayload, imageFile);
      setMessage({ type: 'success', text: 'Product created successfully!' });
      setIsAddingNew(false);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to create product.' });
    }
  };

  const handleUpdateSubmit = async (productPayload, imageFile) => {
    try {
      if (!editingProduct) return;
      await onUpdateProduct(editingProduct.id, productPayload, imageFile);
      setMessage({ type: 'success', text: 'Product updated successfully!' });
      setEditingProduct(null);
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to update product.' });
    }
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    try {
      await onDeleteProduct(deleteCandidate.id);
      setMessage({ type: 'success', text: `Product "${deleteCandidate.name}" deleted successfully.` });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete product.' });
    } finally {
      setDeleteCandidate(null);
    }
  };

  return (
    <div className="admin-dashboard-container">
      {/* Dashboard Top Navigation Bar */}
      <div className="dashboard-header">
        <div>
          <h2>Admin Management Dashboard</h2>
          <p className="dashboard-welcome">
            Logged in as <span className="highlight-user">{user?.email || 'Admin User'}</span>
          </p>
        </div>
        <button onClick={onClose} className="btn btn-outline btn-sm">
          <X size={18} />
          <span>Exit Dashboard</span>
        </button>
      </div>

      {!isSupabaseConfigured && (
        <div className="demo-notice banner-info">
          <ShieldAlert size={18} />
          <div>
            <strong>Demo Storage Mode:</strong> Supabase URL / publishable key default fallback detected. Database modifications will sync to local session state.
          </div>
        </div>
      )}

      {message.text && (
        <div className={`alert-banner alert-${message.type}`}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
          <span>{message.text}</span>
          <button className="banner-dismiss" onClick={() => setMessage({ type: '', text: '' })}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Metrics Overview Cards */}
      <div className="stats-overview-grid">
        <div className="stat-box">
          <div className="stat-box-icon icon-primary">
            <Package size={24} />
          </div>
          <div className="stat-box-content">
            <span className="stat-box-value">{stats.total}</span>
            <span className="stat-box-label">Total Products</span>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-box-icon icon-info">
            <Layers size={24} />
          </div>
          <div className="stat-box-content">
            <span className="stat-box-value">{stats.categoriesCount}</span>
            <span className="stat-box-label">Categories</span>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-box-icon icon-warning">
            <Tag size={24} />
          </div>
          <div className="stat-box-content">
            <span className="stat-box-value">{stats.brandsCount}</span>
            <span className="stat-box-label">Brands</span>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-box-icon icon-success">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-box-content">
            <span className="stat-box-value">{stats.inStockCount}</span>
            <span className="stat-box-label">In Stock</span>
          </div>
        </div>

        <div className="stat-box">
          <div className="stat-box-icon icon-danger">
            <XCircle size={24} />
          </div>
          <div className="stat-box-content">
            <span className="stat-box-value">{stats.outOfStockCount}</span>
            <span className="stat-box-label">Out of Stock</span>
          </div>
        </div>
      </div>

      {/* Product Form Modal / View */}
      {(isAddingNew || editingProduct) && (
        <div className="dashboard-section-overlay">
          <ProductForm
            initialProduct={editingProduct}
            onSubmit={editingProduct ? handleUpdateSubmit : handleCreateSubmit}
            onCancel={() => {
              setIsAddingNew(false);
              setEditingProduct(null);
            }}
          />
        </div>
      )}

      {/* Main Table Management Section */}
      <div className="dashboard-card main-table-card">
        <div className="table-controls-bar">
          <div className="table-search-group">
            <div className="input-with-icon">
              <Search size={18} className="input-icon" />
              <input
                type="text"
                placeholder="Search products in admin table..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select
              className="admin-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories ({stats.categoriesList.length})</option>
              {stats.categoriesList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <button
            className="btn btn-primary btn-sm add-prod-btn"
            onClick={() => {
              setEditingProduct(null);
              setIsAddingNew(true);
            }}
          >
            <PlusCircle size={18} /> Add Product
          </button>
        </div>

        <div className="table-responsive-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Status</th>
                <th>Colors</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-table-cell">
                    No products matched search criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="table-prod-info">
                        <img
                          src={p.image_url || 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'}
                          alt={p.name}
                          className="table-prod-thumb"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                        <div className="table-prod-name-box">
                          <strong>{p.name}</strong>
                          {p.tag && <span className="table-tag-inline">{p.tag}</span>}
                        </div>
                      </div>
                    </td>
                    <td>{p.category || '-'}</td>
                    <td>{p.brand || '-'}</td>
                    <td>
                      {p.price && p.price !== '-' ? `${p.price} ${p.currency}` : <span className="text-muted">-</span>}
                    </td>
                    <td>
                      <button
                        className={`stock-toggle-btn ${p.in_stock ? 'is-in-stock' : 'is-out-stock'}`}
                        onClick={() => onToggleStockStatus(p.id)}
                        title="Click to toggle stock status"
                      >
                        {p.in_stock ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </td>
                    <td>
                      {p.colors && p.colors.length > 0 ? (
                        <div className="table-colors-badges">
                          {p.colors.map((col) => (
                            <span key={col} className="mini-color-badge">{col}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted">None</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button
                          className="action-btn edit-btn"
                          onClick={() => {
                            setIsAddingNew(false);
                            setEditingProduct(p);
                          }}
                          title="Edit product"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => setDeleteCandidate(p)}
                          title="Delete product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog Modal */}
      {deleteCandidate && (
        <div className="modal-overlay" onClick={() => setDeleteCandidate(null)}>
          <div className="modal-card delete-confirm-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group text-danger">
                <AlertTriangle size={20} />
                <h3>Confirm Product Deletion</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setDeleteCandidate(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>
                Are you sure you want to delete <strong>"{deleteCandidate.name}"</strong>?
              </p>
              <p className="text-muted text-sm">
                This action will delete the product record from Supabase database and clear any uploaded media file in Supabase storage.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline btn-sm" onClick={() => setDeleteCandidate(null)}>
                Cancel
              </button>
              <button className="btn btn-danger btn-sm" onClick={confirmDelete}>
                Delete Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
