import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import ProductCard from './ProductCard';
import Header from './Header';
import { Search, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

export default function Catalog({ onNavigate, currentPath }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [inStockOnly, setInStockOnly] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Try smart-catalog first
      let { data, error: fetchErr } = await supabase
        .from('smart-catalog')
        .select('*');

      // 2. If table not found or error, fallback to products
      if (fetchErr || !data) {
        console.warn('Falling back to products table:', fetchErr?.message);
        const fallbackRes = await supabase
          .from('products')
          .select('*');
        if (fallbackRes.error) {
          throw fallbackRes.error;
        }
        data = fallbackRes.data || [];
      }

      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Unable to load catalog products right now. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter products by search term, category, and stock
  const categories = ['ALL', ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !searchTerm ||
      (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.brand && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.tag && product.tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.note && product.note.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'ALL' ||
      (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase());

    const matchesStock = !inStockOnly || Boolean(product.in_stock);

    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      <Header onNavigate={onNavigate} currentPath={currentPath} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Section */}
        <section className="bg-blue-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border-4 border-yellow-400 space-y-4">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-blue-950 font-black px-4 py-1.5 rounded-full text-lg">
            <Sparkles className="w-5 h-5" /> Smart Catalog
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
            Browse Our Easy-To-Read Catalog
          </h2>
          <p className="text-xl sm:text-2xl text-blue-100 max-w-3xl font-medium">
            Clear pictures, large prices, and simple details. Designed for everyone!
          </p>
        </section>

        {/* Controls Section: Search & Category Filter */}
        <section className="bg-white p-6 rounded-2xl border-2 border-slate-300 shadow-md space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            {/* Search Box */}
            <div className="lg:col-span-6 relative">
              <label htmlFor="search" className="block text-lg font-black text-slate-900 mb-2">
                🔍 Search Products:
              </label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Type product name, brand, or item..."
                  className="w-full text-xl font-bold p-4 pl-12 rounded-xl border-2 border-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-yellow-300 outline-none bg-slate-50 text-slate-900 placeholder-slate-500"
                />
                <Search className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-300 hover:bg-slate-400 text-slate-800 font-black rounded-full w-8 h-8 flex items-center justify-center text-lg cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Category Select */}
            <div className="lg:col-span-3">
              <label htmlFor="category" className="block text-lg font-black text-slate-900 mb-2">
                📁 Filter Category:
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-xl font-bold p-4 rounded-xl border-2 border-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-yellow-300 outline-none bg-slate-50 text-slate-900 cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'ALL' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* In Stock Checkbox Toggle */}
            <div className="lg:col-span-3 flex items-end">
              <label className="flex items-center gap-3 bg-amber-100 hover:bg-amber-200 border-2 border-amber-400 p-3.5 rounded-xl cursor-pointer w-full select-none">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-7 h-7 text-blue-900 border-2 border-slate-600 rounded focus:ring-yellow-400 cursor-pointer"
                />
                <span className="text-xl font-extrabold text-slate-900">In-Stock Only</span>
              </label>
            </div>
          </div>
        </section>

        {/* Product Cards Grid: 1 Column on Mobile, 3 Columns on Laptops */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-2xl font-black text-slate-900">
              Showing {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''}
            </h3>
            <button
              onClick={fetchProducts}
              className="bg-slate-200 hover:bg-slate-300 text-slate-900 font-bold px-4 py-2 rounded-xl text-base border border-slate-400 flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-5 h-5" /> Refresh List
            </button>
          </div>

          {loading ? (
            <div className="bg-white rounded-3xl p-12 border-2 border-slate-300 text-center space-y-4">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-8 border-blue-900 border-t-transparent"></div>
              <p className="text-2xl font-black text-slate-800">Loading Products, Please Wait...</p>
            </div>
          ) : error ? (
            <div className="bg-rose-50 border-4 border-rose-400 text-rose-900 rounded-3xl p-8 text-center space-y-4">
              <AlertCircle className="w-16 h-16 text-rose-600 mx-auto" />
              <h4 className="text-3xl font-black">{error}</h4>
              <button
                onClick={fetchProducts}
                className="bg-rose-700 hover:bg-rose-800 text-white font-black text-xl px-8 py-3 rounded-2xl border-2 border-rose-900 shadow-md cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 border-2 border-slate-300 text-center space-y-4">
              <p className="text-3xl font-black text-slate-800">No products found matching your search.</p>
              <p className="text-xl text-slate-600">Try clearing your filters or search keyword.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('ALL');
                  setInStockOnly(false);
                }}
                className="bg-blue-900 hover:bg-blue-800 text-yellow-300 font-black text-xl px-6 py-3 rounded-2xl border-2 border-blue-950 cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, idx) => (
                <ProductCard key={product.id || `prod-${idx}`} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-slate-900 text-white py-8 border-t-4 border-yellow-400 mt-12 text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="text-2xl font-black text-yellow-300">Smart Cataloged</p>
          <p className="text-lg text-slate-300">
            Accessible, Easy-to-read Product Showcase &amp; Management
          </p>
        </div>
      </footer>
    </div>
  );
}
