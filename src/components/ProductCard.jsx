import React, { useState } from 'react';
import { CheckCircle2, XCircle, Tag, Eye } from 'lucide-react';

export default function ProductCard({ product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const colors = Array.isArray(product.colors)
    ? product.colors
    : typeof product.colors === 'string'
    ? product.colors.split(',').map((c) => c.trim()).filter(Boolean)
    : [];

  const priceFormatted = product.price !== null && product.price !== undefined
    ? `${product.currency || '$'}${product.price}`
    : 'Contact for price';

  const defaultImage = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80';

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md border-2 border-slate-300 overflow-hidden flex flex-col justify-between hover:shadow-xl transition-shadow duration-200">
        <div>
          {/* Product Image */}
          <div className="relative bg-slate-100 aspect-square w-full overflow-hidden border-b-2 border-slate-200">
            <img
              src={product.image || product.image_url || defaultImage}
              alt={product.name || 'Product Image'}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = defaultImage;
              }}
            />
            {/* Stock Badge - Extra Large & High Contrast */}
            <div className="absolute top-3 right-3">
              {product.in_stock ? (
                <span className="inline-flex items-center gap-1.5 bg-emerald-700 text-white font-black px-3.5 py-1.5 rounded-full text-base shadow-lg border border-emerald-500">
                  <CheckCircle2 className="w-5 h-5" /> In Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 bg-rose-700 text-white font-black px-3.5 py-1.5 rounded-full text-base shadow-lg border border-rose-500">
                  <XCircle className="w-5 h-5" /> Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Details Body */}
          <div className="p-5 space-y-3">
            {/* Category & Brand Pills */}
            <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-700">
              {product.category && (
                <span className="bg-blue-100 text-blue-900 px-3 py-1 rounded-lg border border-blue-300 uppercase tracking-wide">
                  {product.category}
                </span>
              )}
              {product.brand && (
                <span className="bg-purple-100 text-purple-900 px-3 py-1 rounded-lg border border-purple-300">
                  Brand: {product.brand}
                </span>
              )}
            </div>

            {/* Product Title */}
            <h2 className="text-2xl font-black text-slate-900 leading-tight">
              {product.name || 'Untitled Product'}
            </h2>

            {/* Price Display */}
            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-3 inline-block">
              <span className="text-sm font-bold text-amber-900 block uppercase">Price</span>
              <span className="text-3xl font-black text-amber-900">{priceFormatted}</span>
            </div>

            {/* Note / Description */}
            {product.note && (
              <p className="text-lg font-medium text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900">Note: </span>
                {product.note}
              </p>
            )}

            {/* Tag */}
            {product.tag && (
              <div className="flex items-center gap-2 text-base font-bold text-indigo-800">
                <Tag className="w-5 h-5 text-indigo-600" />
                <span>Tag: {product.tag}</span>
              </div>
            )}

            {/* Colors */}
            {colors.length > 0 && (
              <div>
                <p className="text-base font-bold text-slate-800 mb-1">Available Colors:</p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-200 border border-slate-400 text-slate-900 font-bold px-3 py-1 rounded-lg text-base"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="p-5 pt-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-blue-900 hover:bg-blue-800 text-yellow-300 font-black text-xl py-3.5 px-4 rounded-xl border-2 border-blue-950 shadow-md flex items-center justify-center gap-2 transition focus:ring-4 focus:ring-yellow-400 cursor-pointer"
          >
            <Eye className="w-6 h-6" /> View Details
          </button>
        </div>
      </div>

      {/* Accessible Detail Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border-4 border-blue-900 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-start border-b-2 border-slate-200 pb-4">
              <h2 className="text-3xl font-black text-slate-900 leading-snug">{product.name}</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-red-600 text-white font-black text-xl w-12 h-12 rounded-full border-2 border-red-800 flex items-center justify-center hover:bg-red-700 focus:ring-4 focus:ring-yellow-400 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border-2 border-slate-300 bg-slate-100 max-h-80 flex items-center justify-center">
              <img
                src={product.image || product.image_url || defaultImage}
                alt={product.name}
                className="max-h-80 w-full object-contain"
              />
            </div>

            <div className="space-y-4 text-slate-800">
              <div className="flex items-center justify-between bg-amber-100 border-2 border-amber-300 p-4 rounded-2xl">
                <div>
                  <p className="text-base font-bold text-amber-900 uppercase">Price</p>
                  <p className="text-4xl font-black text-amber-950">{priceFormatted}</p>
                </div>
                <div>
                  {product.in_stock ? (
                    <span className="bg-emerald-700 text-white font-black px-4 py-2 rounded-xl text-lg flex items-center gap-2">
                      <CheckCircle2 className="w-6 h-6" /> In Stock
                    </span>
                  ) : (
                    <span className="bg-rose-700 text-white font-black px-4 py-2 rounded-xl text-lg flex items-center gap-2">
                      <XCircle className="w-6 h-6" /> Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {product.note && (
                <div className="bg-slate-100 p-4 rounded-2xl border-2 border-slate-300">
                  <p className="font-black text-xl text-slate-900 mb-1">Product Description / Note:</p>
                  <p className="text-xl text-slate-800 leading-relaxed">{product.note}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg font-bold">
                {product.category && (
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl">
                    <span className="text-slate-600 block text-sm">Category</span>
                    <span className="text-blue-950 text-xl font-extrabold">{product.category}</span>
                  </div>
                )}
                {product.brand && (
                  <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl">
                    <span className="text-slate-600 block text-sm">Brand</span>
                    <span className="text-purple-950 text-xl font-extrabold">{product.brand}</span>
                  </div>
                )}
                {product.tag && (
                  <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl">
                    <span className="text-slate-600 block text-sm">Tag</span>
                    <span className="text-indigo-950 text-xl font-extrabold">{product.tag}</span>
                  </div>
                )}
                {colors.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
                    <span className="text-slate-600 block text-sm mb-1">Colors</span>
                    <div className="flex flex-wrap gap-1.5">
                      {colors.map((c, i) => (
                        <span key={i} className="bg-slate-200 px-2.5 py-0.5 rounded-lg text-slate-900 font-bold text-base border border-slate-400">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t-2 border-slate-200">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-black text-xl py-4 rounded-2xl border-2 border-slate-950 cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
