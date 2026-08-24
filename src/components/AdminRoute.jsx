import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import Header from './Header';
import { Lock, LogOut, Upload, PlusCircle, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';

export default function AdminRoute() {
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
    if (usernameInput === 'KyiKyi2026' && passwordInput === 'Ze9112004Ze') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid Username or Password. Please check and try again.');
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
        // Lightweight image compression using HTML5 Canvas
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

        // Convert canvas output to JPEG Blob with 0.82 quality for lightweight storage
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

      // Upload file to Supabase Storage Bucket 'uploads' if file is provided
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

        // Retrieve Public URL
        const { data: publicUrlData } = supabase.storage
          .from('uploads')
          .getPublicUrl(filePath);

        uploadedImageUrl = publicUrlData.publicUrl;
      }

      // Convert comma separated colors to Array
      const colorsArray = colorsInput
        ? colorsInput.split(',').map((c) => c.trim()).filter(Boolean)
        : [];

      // Payload object
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

      // Try inserting into 'smart-catalog' table first, fallback to 'products'
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

      // Reset Form Fields
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
      <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
        <Header />
        <main className="flex-1 max-w-md w-full mx-auto p-4 flex items-center justify-center my-12">
          <div className="bg-white rounded-3xl p-8 border-4 border-blue-900 shadow-2xl w-full space-y-6">
            <div className="text-center space-y-2">
              <div className="bg-blue-900 text-yellow-300 p-4 rounded-2xl inline-block shadow-md">
                <Lock className="w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black text-slate-900">Admin Login</h2>
              <p className="text-lg font-bold text-slate-600">
                Please enter credentials to manage catalog items.
              </p>
            </div>

            {loginError && (
              <div className="bg-rose-100 border-2 border-rose-400 text-rose-900 p-4 rounded-xl flex items-center gap-3 font-bold text-base">
                <AlertCircle className="w-6 h-6 flex-shrink-0 text-rose-700" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-lg font-black text-slate-900 mb-2">
                  Admin Username
                </label>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Enter username"
                  className="w-full text-xl font-bold p-4 rounded-xl border-2 border-slate-400 focus:border-blue-800 focus:ring-4 focus:ring-yellow-300 outline-none bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-lg font-black text-slate-900 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter password"
                  className="w-full text-xl font-bold p-4 rounded-xl border-2 border-slate-400 focus:border-blue-800 focus:ring-4 focus:ring-yellow-300 outline-none bg-slate-50"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800 text-yellow-300 font-black text-2xl py-4 rounded-xl border-2 border-blue-950 shadow-lg cursor-pointer transition focus:ring-4 focus:ring-yellow-400"
              >
                Log In to Admin
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  // Authenticated Admin Dashboard UI
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Header isAdminLoggedIn={true} onLogoutAdmin={handleLogout} />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Admin Welcome Bar */}
        <div className="bg-blue-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border-4 border-yellow-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="bg-yellow-400 text-blue-950 font-black px-4 py-1 rounded-full text-base uppercase tracking-wider">
              Admin Mode
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
              Add New Catalog Item
            </h2>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-700 hover:bg-red-600 text-white font-black text-lg px-6 py-3 rounded-2xl border-2 border-red-900 flex items-center gap-2 cursor-pointer shadow-md"
          >
            <LogOut className="w-5 h-5" /> Logout Admin
          </button>
        </div>

        {/* Status Alert Banner */}
        {statusMessage && (
          <div
            className={`p-6 rounded-2xl border-4 flex items-center gap-4 text-xl font-black shadow-md ${
              statusMessage.type === 'success'
                ? 'bg-emerald-100 border-emerald-600 text-emerald-950'
                : 'bg-rose-100 border-rose-600 text-rose-950'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-700 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-8 h-8 text-rose-700 flex-shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Product Addition Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-4 border-slate-300 shadow-xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-xl font-black text-slate-900 mb-2">
                1. Product Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ergonomic Reader Glasses"
                className="w-full text-xl font-bold p-4 rounded-xl border-2 border-slate-400 focus:border-blue-800 focus:ring-4 focus:ring-yellow-300 outline-none bg-slate-50"
              />
            </div>

            {/* Price & Currency Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xl font-black text-slate-900 mb-2">
                  2. Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 29.99"
                  className="w-full text-xl font-bold p-4 rounded-xl border-2 border-slate-400 focus:border-blue-800 focus:ring-4 focus:ring-yellow-300 outline-none bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xl font-black text-slate-900 mb-2">
                  3. Currency Symbol
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full text-xl font-bold p-4 rounded-xl border-2 border-slate-400 focus:border-blue-800 focus:ring-4 focus:ring-yellow-300 outline-none bg-slate-50 cursor-pointer"
                >
                  <option value="$">$ (USD)</option>
                  <option value="€">€ (EUR)</option>
                  <option value="£">£ (GBP)</option>
                  <option value="¥">¥ (JPY)</option>
                  <option value="MMK">MMK (Kyat)</option>
                </select>
              </div>
            </div>

            {/* In Stock Checkbox */}
            <div className="bg-amber-50 p-4 rounded-2xl border-2 border-amber-300">
              <label className="flex items-center gap-4 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e) => setInStock(e.target.checked)}
                  className="w-8 h-8 text-emerald-700 border-2 border-slate-600 rounded focus:ring-yellow-400 cursor-pointer"
                />
                <span className="text-2xl font-extrabold text-slate-900">
                  Product is In Stock
                </span>
              </label>
            </div>

            {/* Lightweight Image Uploader */}
            <div className="bg-slate-50 p-6 rounded-2xl border-2 border-slate-300 space-y-4">
              <label className="block text-xl font-black text-slate-900">
                4. Lightweight Image Uploader (Supabase Storage 'uploads')
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <label className="bg-blue-900 hover:bg-blue-800 text-yellow-300 font-extrabold text-xl px-6 py-4 rounded-2xl border-2 border-blue-950 flex items-center gap-3 cursor-pointer shadow-md focus-within:ring-4 focus-within:ring-yellow-400">
                  <Upload className="w-6 h-6" />
                  Choose Image File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>

                {previewUrl ? (
                  <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border-2 border-slate-300">
                    <img
                      src={previewUrl}
                      alt="Selected preview"
                      className="w-20 h-20 object-cover rounded-xl border border-slate-300"
                    />
                    <div>
                      <p className="font-extrabold text-slate-900 text-base">
                        Image Compressed &amp; Ready
                      </p>
                      <p className="text-sm font-bold text-emerald-700">Lightweight preview</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-slate-500 font-bold text-lg">
                    <ImageIcon className="w-6 h-6" /> No image selected
                  </div>
                )}
              </div>
            </div>

            {/* Category & Brand Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xl font-black text-slate-900 mb-2">
                  5. Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Electronics, Health"
                  className="w-full text-xl font-bold p-4 rounded-xl border-2 border-slate-400 focus:border-blue-800 focus:ring-4 focus:ring-yellow-300 outline-none bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xl font-black text-slate-900 mb-2">
                  6. Brand
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. SmartTech"
                  className="w-full text-xl font-bold p-4 rounded-xl border-2 border-slate-400 focus:border-blue-800 focus:ring-4 focus:ring-yellow-300 outline-none bg-slate-50"
                />
              </div>
            </div>

            {/* Tag & Colors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xl font-black text-slate-900 mb-2">
                  7. Tag
                </label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. Best Seller"
                  className="w-full text-xl font-bold p-4 rounded-xl border-2 border-slate-400 focus:border-blue-800 focus:ring-4 focus:ring-yellow-300 outline-none bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xl font-black text-slate-900 mb-2">
                  8. Colors (separated by comma)
                </label>
                <input
                  type="text"
                  value={colorsInput}
                  onChange={(e) => setColorsInput(e.target.value)}
                  placeholder="e.g. Red, Blue, Black"
                  className="w-full text-xl font-bold p-4 rounded-xl border-2 border-slate-400 focus:border-blue-800 focus:ring-4 focus:ring-yellow-300 outline-none bg-slate-50"
                />
              </div>
            </div>

            {/* Note / Description */}
            <div>
              <label className="block text-xl font-black text-slate-900 mb-2">
                9. Note / Description
              </label>
              <textarea
                rows="3"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter helpful product description or special instructions..."
                className="w-full text-xl font-bold p-4 rounded-xl border-2 border-slate-400 focus:border-blue-800 focus:ring-4 focus:ring-yellow-300 outline-none bg-slate-50"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-700 hover:bg-emerald-600 disabled:bg-slate-400 text-white font-black text-2xl py-5 rounded-2xl border-2 border-emerald-900 shadow-xl flex items-center justify-center gap-3 transition cursor-pointer focus:ring-4 focus:ring-yellow-400"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                  Uploading &amp; Saving Product...
                </>
              ) : (
                <>
                  <PlusCircle className="w-8 h-8" /> Save Product To Catalog
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
