import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import ProductCard from './ProductCard';
import Header from './Header';
import { Search, RefreshCw, AlertCircle, Sparkles, Terminal, Filter } from 'lucide-react';

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

      // 2. Fallback to products table
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
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100">
      <Header onNavigate={onNavigate} currentPath={currentPath} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-8">
        {/* Banner Section */}
        <section className="bg-slate-900 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-10 shadow-2xl border border-blue-600/60 relative overflow-hidden space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-blue-600/20 text-blue-300 font-mono text-xs sm:text-sm px-3.5 py-1 rounded-full border border-blue-500/40">
            <Sparkles className="w-4 h-4 text-blue-400" /> Smart Catalog Engine
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
            Browse Our Official Smart Catalog
          </h2>
          <p className="text-xs sm:text-lg text-slate-300 max-w-3xl font-medium leading-relaxed">
            Clear pictures, large prices, and simple details. Designed for seamless mobile &amp; desktop browsing.
          </p>
        </section>

        {/* Controls Section: Responsive Search & Category Filter */}
        <section className="bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center">
            {/* Search Box */}
            <div className="md:col-span-6 relative">
              <label htmlFor="search" className="block text-xs sm:text-sm font-mono font-bold text-blue-400 mb-1.5 flex items-center gap-1.5">
                <Search className="w-4 h-4 text-blue-400" /> Search Products:
              </label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Type product name, brand, tag..."
                  className="w-full text-sm sm:text-base font-medium p-3 sm:p-3.5 pl-10 rounded-xl border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-950 text-white placeholder-slate-500"
                />
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Category Select */}
            <div className="md:col-span-3">
              <label htmlFor="category" className="block text-xs sm:text-sm font-mono font-bold text-blue-400 mb-1.5 flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-blue-400" /> Category:
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full text-sm sm:text-base font-medium p-3 sm:p-3.5 rounded-xl border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-950 text-white cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'ALL' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* In Stock Toggle */}
            <div className="md:col-span-3 flex items-end">
              <label className="flex items-center gap-3 bg-slate-950 hover:bg-slate-800 border border-slate-700 p-3 sm:p-3.5 rounded-xl cursor-pointer w-full select-none transition">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-slate-600 rounded focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-xs sm:text-sm font-bold text-slate-200">In-Stock Only</span>
              </label>
            </div>
          </div>
        </section>

        {/* Product Cards Grid: 1 Column on Mobile, 2 on Tablet, 3 on Desktop */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-xl font-bold font-mono text-slate-200">
              Showing {filteredProducts.length} Product{filteredProducts.length !== 1 ? 's' : ''}
            </h3>
            <button
              onClick={fetchProducts}
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 font-medium px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm border border-slate-700 flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-4 h-4 text-blue-400" /> Refresh
            </button>
          </div>

          {loading ? (
            <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-800 text-center space-y-4">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-base sm:text-xl font-mono text-slate-300">Loading Catalog Items...</p>
            </div>
          ) : error ? (
            <div className="bg-rose-950/60 border border-rose-800 text-rose-200 rounded-3xl p-6 sm:p-8 text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-rose-400 mx-auto" />
              <h4 className="text-lg sm:text-2xl font-bold">{error}</h4>
              <button
                onClick={fetchProducts}
                className="bg-rose-800 hover:bg-rose-700 text-white font-bold text-sm sm:text-base px-6 py-2.5 rounded-xl border border-rose-600 cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-800 text-center space-y-4">
              <p className="text-lg sm:text-2xl font-bold text-slate-300">No products match your filter.</p>
              <p className="text-xs sm:text-sm text-slate-400">Try clearing your search terms or filters.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('ALL');
                  setInStockOnly(false);
                }}
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm sm:text-base px-5 py-2.5 rounded-xl border border-blue-400 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product, idx) => (
                <ProductCard key={product.id || `prod-${idx}`} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-6 sm:py-8 border-t border-slate-800 mt-12 text-center text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 space-y-1 font-mono">
          <p className="font-bold text-blue-400">Smart Cataloged // CEIT Official Platform</p>
          <p className="text-slate-500">
            Accessible Product Showcase &amp; CEIT RAG Assistant
          </p>
        </div>
      </footer>
    </div>
  );
}
