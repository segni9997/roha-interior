import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Image as ImageIcon
} from 'lucide-react';
import { resolveImageUrl, type GalleryImageItem } from '../services/api';

interface ResponsiveContentGalleryProps {
  images: GalleryImageItem[];
  title?: string;
  subtitle?: string;
  className?: string;
  columns?: 2 | 3 | 4;
  theme?: 'dark' | 'light';
}

export const ResponsiveContentGallery: React.FC<ResponsiveContentGalleryProps> = ({
  images,
  title = "Curated Visual Gallery",
  subtitle = "High-Resolution Architectural Photography & Spatial Documentation",
  className = "",
  columns = 3,
  theme = 'dark',
}) => {
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  const validImages = (images || []).filter((img) => Boolean(img.image));

  const handleNext = useCallback(() => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((prev) => ((prev! + 1) % validImages.length));
  }, [activeLightboxIndex, validImages.length]);

  const handlePrev = useCallback(() => {
    if (activeLightboxIndex === null) return;
    setActiveLightboxIndex((prev) => (prev! - 1 + validImages.length) % validImages.length);
  }, [activeLightboxIndex, validImages.length]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (activeLightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveLightboxIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeLightboxIndex, handleNext, handlePrev]);

  if (validImages.length === 0) {
    return null;
  }

  const gridColsClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }[columns];

  const isDark = theme === 'dark';

  return (
    <div className={`w-full my-12 ${className}`}>
      {/* Header section */}
      {(title || subtitle) && (
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1 rounded-md bg-[#205b63]/30 text-cyan-400">
                <ImageIcon size={14} />
              </span>
              <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-cyan-300">
                Visual Documentation
              </span>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {title}
            </h3>
            {subtitle && (
              <p className={`text-xs sm:text-sm font-mono mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-mono px-3 py-1 rounded-full border ${
              isDark 
                ? 'bg-[#172e31] text-cyan-300 border-[#205b63]' 
                : 'bg-cyan-50 text-[#205b63] border-cyan-200'
            }`}>
              {validImages.length} {validImages.length === 1 ? 'FRAME' : 'FRAMES'}
            </span>
          </div>
        </div>
      )}

      {/* Responsive Gallery Grid */}
      <div className={`grid ${gridColsClass} gap-5 sm:gap-6`}>
        {validImages.map((imgItem, idx) => {
          const imgSrc = resolveImageUrl(imgItem.image, '/tr/279A1756.JPG');
          return (
            <motion.div
              key={imgItem.id || idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              onClick={() => setActiveLightboxIndex(idx)}
              className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:-translate-y-1 ${
                isDark 
                  ? 'bg-[#0c1315] border border-slate-800/90 shadow-xl hover:border-[#205b63]/60' 
                  : 'bg-white border border-slate-200 shadow-lg hover:border-[#205b63]/50'
              }`}
            >
              {/* Image Container */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900/20">
                <img
                  src={imgSrc}
                  alt={imgItem.caption || `Gallery frame ${idx + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
                
                {/* Gradient scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />

                {/* Hover overlay button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="p-3 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                    <Maximize2 size={18} />
                  </span>
                </div>

                {/* Index tag */}
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-white/10">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Caption Card */}
              {(imgItem.caption || imgItem.subtitle) && (
                <div className="p-4 space-y-1">
                  {imgItem.caption && (
                    <h4 className={`text-xs sm:text-sm font-bold truncate leading-snug ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}>
                      {imgItem.caption}
                    </h4>
                  )}
                  {imgItem.subtitle && (
                    <p className={`text-[11px] font-mono truncate ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {imgItem.subtitle}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Fullscreen Interactive Lightbox Modal */}
      <AnimatePresence>
        {activeLightboxIndex !== null && validImages[activeLightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-8 select-none"
            onClick={() => setActiveLightboxIndex(null)}
          >
            {/* Top Lightbox Bar */}
            <div
              className="flex items-center justify-between text-white pb-4 border-b border-white/10 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-md bg-[#205b63] text-white text-xs font-mono font-bold uppercase tracking-wider">
                  {String(activeLightboxIndex + 1).padStart(2, '0')} / {String(validImages.length).padStart(2, '0')}
                </span>
                <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                  {validImages[activeLightboxIndex].caption || 'Spatial Perspective Frame'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-slate-500 hidden md:inline">
                  Use ← → keys or swipe to navigate
                </span>
                <button
                  type="button"
                  onClick={() => setActiveLightboxIndex(null)}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Close Lightbox"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Central Lightbox Image Viewport */}
            <div
              className="relative flex-1 flex items-center justify-center py-4 my-auto overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeLightboxIndex}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  src={resolveImageUrl(validImages[activeLightboxIndex].image, '/tr/279A1756.JPG')}
                  alt={validImages[activeLightboxIndex].caption || `Gallery frame ${activeLightboxIndex + 1}`}
                  className="max-h-[75vh] max-w-[92vw] sm:max-w-[85vw] object-contain rounded-2xl shadow-2xl border border-white/10"
                />
              </AnimatePresence>

              {/* Prev / Next Floating Navigation */}
              {validImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-[#205b63] text-white backdrop-blur-md border border-white/20 shadow-2xl transition-all cursor-pointer group"
                    title="Previous Image"
                  >
                    <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 sm:p-4 rounded-full bg-black/60 hover:bg-[#205b63] text-white backdrop-blur-md border border-white/20 shadow-2xl transition-all cursor-pointer group"
                    title="Next Image"
                  >
                    <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Caption & Thumbnails */}
            <div
              className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">
                  {validImages[activeLightboxIndex].caption || 'Architectural Still'}
                </h4>
                {validImages[activeLightboxIndex].subtitle && (
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    {validImages[activeLightboxIndex].subtitle}
                  </p>
                )}
              </div>

              {/* Mini Thumbnails Strip */}
              {validImages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
                  {validImages.map((thumb, tIdx) => (
                    <button
                      key={thumb.id || tIdx}
                      type="button"
                      onClick={() => setActiveLightboxIndex(tIdx)}
                      className={`relative w-12 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        activeLightboxIndex === tIdx
                          ? 'border-cyan-400 scale-105 shadow-md'
                          : 'border-transparent opacity-50 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={resolveImageUrl(thumb.image, '/tr/279A1756.JPG')}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
