import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import Header from './Header';
import { Lock, LogOut, Upload, PlusCircle, CheckCircle2, AlertCircle, Image as ImageIcon, Shield } from 'lucide-react';

export default function AdminRoute({ onNavigate, currentPath }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('admin_authenticated') === 'true';
  });

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Product Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('$');
  const [inStock, setInStock] = useState(true);
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [tag, setTag] = useState('');
  const [colorsInput, setColorsInput] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  // Authentication Handler
  const handleLogin = (e) => {
    e.preventDefault();
    const validUsernames = ['zinmyoenaing873@gmail.com', 'kyikyi2026', 'admin'];
    const validPasswords = ['Ze9112004Ze!', 'Ze9112004Ze'];

    if (
      validUsernames.includes(usernameInput.trim().toLowerCase()) &&
      validPasswords.includes(passwordInput.trim())
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid Admin Email/Username or Password. Please check and try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
  };

  // Image Selection & Client-Side Canvas Compression
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatusMessage({ type: 'error', text: 'Please select a valid image file.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              setSelectedFile(compressedFile);
              setPreviewUrl(URL.createObjectURL(blob));
            } else {
              setSelectedFile(file);
              setPreviewUrl(event.target.result);
            }
          },
          'image/jpeg',
          0.82
        );
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setStatusMessage({ type: 'error', text: 'Product Name is required.' });
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);

    try {
      let uploadedImageUrl = '';

      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(filePath, selectedFile, {
            contentType: 'image/jpeg',
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          console.error('Storage upload error:', uploadError);
          throw new Error(`Image upload failed: ${uploadError.message}`);
        }

        const { data: publicUrlData } = supabase.storage
          .from('uploads')
          .getPublicUrl(filePath);

        uploadedImageUrl = publicUrlData.publicUrl;
      }

      const colorsArray = colorsInput
        ? colorsInput.split(',').map((c) => c.trim()).filter(Boolean)
        : [];

      const newProductData = {
        name: name.trim(),
        price: price ? parseFloat(price) : null,
        currency: currency || '$',
        in_stock: Boolean(inStock),
        note: note.trim() || null,
        category: category.trim() || null,
        brand: brand.trim() || null,
        tag: tag.trim() || null,
        colors: colorsArray,
        image: uploadedImageUrl || null,
        image_url: uploadedImageUrl || null,
      };

      let insertErr = null;
      const res1 = await supabase.from('smart-catalog').insert([newProductData]);

      if (res1.error) {
        console.warn('Inserting into smart-catalog failed, trying products:', res1.error.message);
        const res2 = await supabase.from('products').insert([newProductData]);
        if (res2.error) {
          insertErr = res2.error;
        }
      }

      if (insertErr) {
        throw new Error(`Database insert failed: ${insertErr.message}`);
      }

      setStatusMessage({
        type: 'success',
        text: 'Product successfully added to the catalog!',
      });

      setName('');
      setPrice('');
      setCurrency('$');
      setInStock(true);
      setNote('');
      setCategory('');
      setBrand('');
      setTag('');
      setColorsInput('');
      setSelectedFile(null);
      setPreviewUrl('');
    } catch (err) {
      console.error('Submission error:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Login UI when unauthenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100">
        <Header onNavigate={onNavigate} currentPath={currentPath} />
        <main className="flex-1 max-w-md w-full mx-auto px-4 py-8 sm:py-12 flex items-center justify-center">
          <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl w-full space-y-6">
            <div className="text-center space-y-2">
              <div className="bg-blue-600/20 text-blue-400 p-3.5 rounded-2xl inline-block border border-blue-500/40">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Admin Login</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Enter admin email &amp; password to manage catalog items.
              </p>
            </div>

            {loginError && (
              <div className="bg-rose-950/80 border border-rose-800 text-rose-200 p-3.5 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-mono font-bold text-blue-400 mb-1.5">
                  Admin Email / Username
                </label>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="e.g. zinmyoenaing873@gmail.com"
                  className="w-full text-sm sm:text-base font-medium p-3 sm:p-3.5 rounded-xl border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-950 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-mono font-bold text-blue-400 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter password"
                  className="w-full text-sm sm:text-base font-medium p-3 sm:p-3.5 rounded-xl border border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none bg-slate-950 text-white placeholder-slate-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-base sm:text-lg py-3.5 rounded-xl border border-blue-400 shadow-lg cursor-pointer transition active:scale-95"
              >
                Log In to Admin Portal
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  // Authenticated Admin Dashboard UI
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100">
      <Header isAdminLoggedIn={true} onLogoutAdmin={handleLogout} onNavigate={onNavigate} currentPath={currentPath} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6">
        {/* Admin Welcome Header */}
        <div className="bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="bg-blue-600/20 text-blue-400 font-mono text-xs font-bold px-3 py-1 rounded-full border border-blue-500/40 uppercase tracking-wider">
              Admin Dashboard
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-white mt-2">
              Add New Catalog Item
            </h2>
          </div>
          <button
            onClick={handleLogout}
            className="bg-rose-950/80 hover:bg-rose-900 text-rose-200 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-rose-800 flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95"
          >
            <LogOut className="w-4 h-4" /> Logout Admin
          </button>
        </div>

        {/* Status Alert Banner */}
        {statusMessage && (
          <div
            className={`p-4 sm:p-5 rounded-2xl border flex items-center gap-3 text-sm sm:text-base font-bold shadow-md ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/80 border-emerald-800 text-emerald-200'
                : 'bg-rose-950/80 border-rose-800 text-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-6 h-6 text-rose-400 flex-shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Product Form */}
        <div className="bg-slate-900 rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-xs sm:text-sm font-mono font-bold text-blue-400 mb-1.5">
                1. Product Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ergonomic Reader Glasses"
                className="w-full text-sm sm:text-base font-medium p-3 sm:p-3.5 rounded-xl border border-slate-700 focus:border-blue-500 outline-none bg-slate-950 text-white placeholder-slate-500"
              />
            </div>

            {/* Price & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-mono font-bold text-blue-400 mb-1.5">
                  2. Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 29.99"
                  className="w-full text-sm sm:text-base font-medium p-3 sm:p-3.5 rounded-xl border border-slate-700 focus:border-blue-500 outline-none bg-slate-950 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-mono font-bold text-blue-400 mb-1.5">
                  3. Currency Symbol
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full text-sm sm:text-base font-medium p-3 sm:p-3.5 rounded-xl border border-slate-700 focus:border-blue-500 outline-none bg-slate-950 text-white cursor-pointer"
                >
                  <option value="$">$ (USD)</option>
                  <option value="€">€ (EUR)</option>
                  <option value="£">£ (GBP)</option>
                  <option value="¥">¥ (JPY)</option>
                  <option value="MMK">MMK (Kyat)</option>
                </select>
              </div>
            </div>

            {/* Stock Toggle */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-slate-600 rounded focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm font-bold text-slate-200">
                  Product is In Stock
                </span>
              </label>
            </div>

            {/* Image Uploader */}
            <div className="bg-slate-950 p-4 sm:p-5 rounded-xl border border-slate-800 space-y-3">
              <label className="block text-xs sm:text-sm font-mono font-bold text-blue-400">
                4. Image Upload (Supabase Storage 'uploads')
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <label className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm px-4 py-3 rounded-xl border border-blue-400 flex items-center gap-2 cursor-pointer transition active:scale-95">
                  <Upload className="w-4 h-4" />
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>

                {previewUrl ? (
                  <div className="flex items-center gap-3 bg-slate-900 p-2.5 rounded-xl border border-slate-700">
                    <img
                      src={previewUrl}
                      alt="Selected preview"
                      className="w-14 h-14 object-cover rounded-lg border border-slate-700"
                    />
                    <div>
                      <p className="font-bold text-slate-200 text-xs">
                        Image Compressed
                      </p>
                      <p className="text-[10px] text-emerald-400 font-mono">Ready to upload</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium text-xs">
                    <ImageIcon className="w-4 h-4" /> No file selected
                  </div>
                )}
              </div>
            </div>

            {/* Category & Brand */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-mono font-bold text-blue-400 mb-1.5">
                  5. Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Electronics, Health"
                  className="w-full text-sm sm:text-base font-medium p-3 sm:p-3.5 rounded-xl border border-slate-700 focus:border-blue-500 outline-none bg-slate-950 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-mono font-bold text-blue-400 mb-1.5">
                  6. Brand
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. SmartTech"
                  className="w-full text-sm sm:text-base font-medium p-3 sm:p-3.5 rounded-xl border border-slate-700 focus:border-blue-500 outline-none bg-slate-950 text-white placeholder-slate-500"
                />
              </div>
            </div>

            {/* Tag & Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-mono font-bold text-blue-400 mb-1.5">
                  7. Tag
                </label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. Best Seller"
                  className="w-full text-sm sm:text-base font-medium p-3 sm:p-3.5 rounded-xl border border-slate-700 focus:border-blue-500 outline-none bg-slate-950 text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-mono font-bold text-blue-400 mb-1.5">
                  8. Colors (separated by comma)
                </label>
                <input
                  type="text"
                  value={colorsInput}
                  onChange={(e) => setColorsInput(e.target.value)}
                  placeholder="e.g. Red, Blue, Black"
                  className="w-full text-sm sm:text-base font-medium p-3 sm:p-3.5 rounded-xl border border-slate-700 focus:border-blue-500 outline-none bg-slate-950 text-white placeholder-slate-500"
                />
              </div>
            </div>

            {/* Description / Note */}
            <div>
              <label className="block text-xs sm:text-sm font-mono font-bold text-blue-400 mb-1.5">
                9. Note / Description
              </label>
              <textarea
                rows="3"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter helpful description or note..."
                className="w-full text-sm sm:text-base font-medium p-3 sm:p-3.5 rounded-xl border border-slate-700 focus:border-blue-500 outline-none bg-slate-950 text-white placeholder-slate-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-white font-bold text-base sm:text-lg py-4 rounded-xl border border-emerald-400 shadow-xl flex items-center justify-center gap-2 transition cursor-pointer active:scale-95"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Saving Product...
                </>
              ) : (
                <>
                  <PlusCircle className="w-5 h-5" /> Save Product To Catalog
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
