import React, { useState, useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';

export default function ImageGallery({ images = [], title = "Event Image" }) {
  const [selectedImage, setSelectedImage] = useState(null);

  // Filter out any invalid/empty string images
  const validImages = images.filter((img) => img && typeof img === 'string' && img.trim() !== '');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };
    if (selectedImage) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  if (validImages.length === 0) {
    return null; // Do not show empty image placeholders
  }

  return (
    <div className="w-full space-y-4">
      {/* 1 Image Layout */}
      {validImages.length === 1 && (
        <div className="relative w-full aspect-[16/9] max-h-[500px] overflow-hidden rounded-2xl border border-slate-200 shadow-md group cursor-pointer bg-slate-100">
          <img
            src={validImages[0]}
            alt={`${title} - Main Image`}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            onClick={() => setSelectedImage(validImages[0])}
          />
          <button
            type="button"
            onClick={() => setSelectedImage(validImages[0])}
            aria-label="Enlarge image"
            className="absolute bottom-4 right-4 bg-slate-900/80 hover:bg-slate-900 text-white p-2.5 rounded-xl backdrop-blur-md transition-opacity opacity-90 hover:opacity-100 flex items-center gap-2 text-xs font-bold"
          >
            <ZoomIn className="w-4 h-4" /> Expand
          </button>
        </div>
      )}

      {/* 2 Images Layout */}
      {validImages.length === 2 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {validImages.map((imgUrl, idx) => (
            <div
              key={idx}
              className="relative aspect-[4/3] max-h-[380px] overflow-hidden rounded-2xl border border-slate-200 shadow-sm group cursor-pointer bg-slate-100"
              onClick={() => setSelectedImage(imgUrl)}
            >
              <img
                src={imgUrl}
                alt={`${title} - Image ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              />
              <button
                type="button"
                onClick={() => setSelectedImage(imgUrl)}
                aria-label={`Enlarge image ${idx + 1}`}
                className="absolute bottom-3 right-3 bg-slate-900/80 text-white p-2 rounded-lg backdrop-blur-md hover:bg-slate-900 transition-opacity flex items-center gap-1.5 text-xs font-semibold"
              >
                <ZoomIn className="w-3.5 h-3.5" /> View
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 3 Images Layout */}
      {validImages.length >= 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Large Image */}
          <div
            className="lg:col-span-2 relative aspect-[16/10] max-h-[420px] overflow-hidden rounded-2xl border border-slate-200 shadow-sm group cursor-pointer bg-slate-100"
            onClick={() => setSelectedImage(validImages[0])}
          >
            <img
              src={validImages[0]}
              alt={`${title} - Main Image`}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
            />
            <button
              type="button"
              onClick={() => setSelectedImage(validImages[0])}
              aria-label="Enlarge main image"
              className="absolute bottom-3 right-3 bg-slate-900/80 text-white p-2 rounded-lg backdrop-blur-md hover:bg-slate-900 transition-opacity flex items-center gap-1.5 text-xs font-semibold"
            >
              <ZoomIn className="w-3.5 h-3.5" /> View
            </button>
          </div>

          {/* 2 Supporting Images Stacked */}
          <div className="flex flex-col gap-4">
            {validImages.slice(1, 3).map((imgUrl, idx) => (
              <div
                key={idx}
                className="relative aspect-[16/9] lg:aspect-[16/8] overflow-hidden rounded-2xl border border-slate-200 shadow-sm group cursor-pointer bg-slate-100 flex-1"
                onClick={() => setSelectedImage(imgUrl)}
              >
                <img
                  src={imgUrl}
                  alt={`${title} - Supporting Image ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
                <button
                  type="button"
                  onClick={() => setSelectedImage(imgUrl)}
                  aria-label={`Enlarge supporting image ${idx + 1}`}
                  className="absolute bottom-2 right-2 bg-slate-900/80 text-white p-1.5 rounded-lg backdrop-blur-md hover:bg-slate-900 transition-opacity flex items-center gap-1 text-[11px] font-semibold"
                >
                  <ZoomIn className="w-3 h-3" /> View
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accessible Lightbox / Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label="Image Preview Modal"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              aria-label="Close image modal"
              className="absolute -top-12 right-0 text-white hover:text-sky-300 bg-slate-800/80 hover:bg-slate-800 p-2 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage}
              alt="Enlarged view"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-slate-700"
            />
          </div>
        </div>
      )}
    </div>
  );
}
