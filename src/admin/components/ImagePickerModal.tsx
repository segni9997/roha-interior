import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Image as ImageIcon, Search, UploadCloud, Loader2, AlertCircle, Film, Laptop } from 'lucide-react';
import { api, resolveImageUrl } from '../../services/api';

interface ImagePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentValue?: string;
  title?: string;
  acceptVideo?: boolean;
}

// Curated list of actual studio architectural photography from public/ and public/tr/
const STUDIO_PHOTO_ASSETS = [
  { path: '/tr/279A1756.JPG', title: 'Minimalist Monolith Pavilion', category: 'Interior' },
  { path: '/tr/279A1757.JPG', title: 'Executive Boardroom Detail', category: 'Interior' },
  { path: '/tr/279A1758.JPG', title: 'Atrium Light Shaft', category: 'Architecture' },
  { path: '/tr/279A1759.JPG', title: 'Timber & Travertine Lounge', category: 'Interior' },
  { path: '/tr/279A1760.JPG', title: 'Curvilinear Reception Wall', category: 'Interior' },
  { path: '/tr/279A1761.JPG', title: 'Acoustic Slat Ceiling', category: 'Detail' },
  { path: '/tr/279A1762.JPG', title: 'Private Residence Salon', category: 'Interior' },
  { path: '/tr/279A1763.JPG', title: 'Cantilevered Mezzanine', category: 'Architecture' },
  { path: '/tr/279A1764.JPG', title: 'Raw Concrete & Brass Joinery', category: 'Detail' },
  { path: '/tr/279A1765.JPG', title: 'Double Height Gallery', category: 'Interior' },
  { path: '/tr/279A1766.JPG', title: 'Bespoke Executive Desk', category: 'Furniture' },
  { path: '/tr/279A1767.JPG', title: 'Perforated Copper Facade Study', category: 'Model' },
  { path: '/tr/279A1768.JPG', title: 'Fluted Glass Partitioning', category: 'Interior' },
  { path: '/tr/279A1769.JPG', title: 'Subtle Linear Luminaire', category: 'Lighting' },
  { path: '/tr/279A1770.JPG', title: 'Terrazzo & Walnut Master Bath', category: 'Interior' },
  { path: '/tr/279A1771.JPG', title: 'Architectural Library Nook', category: 'Interior' },
  { path: '/tr/279A1772.JPG', title: 'Conference Center Wing', category: 'Architecture' },
  { path: '/tr/279A1773.JPG', title: 'Structural Steel Column Detail', category: 'Detail' },
  { path: '/tr/279A1812.JPG', title: 'Physical Scale Tower Model', category: 'Model' },
  { path: '/tr/279A1813.JPG', title: 'Laser-Cut Acrylic Massing', category: 'Model' },
  { path: '/tr/279A1815.JPG', title: 'Urban Masterplan Topography', category: 'Model' },
  { path: '/tr/279A1816.JPG', title: 'Basswood Sectional Cut', category: 'Model' },
  { path: '/tr/279A1817.JPG', title: 'Micro-Illuminated Podium', category: 'Model' },
  { path: '/tr/279A1818.JPG', title: 'High-Rise Aerodynamic Shell', category: 'Model' },
  { path: '/tr/4V0A0305.JPG', title: 'Civic Cultural Center Model', category: 'Model' },
  { path: '/tr/4V0A0306.JPG', title: 'Museum Plaza Diorama', category: 'Model' },
  { path: '/tr/4V0A0307.JPG', title: 'Parametric Timber Lattice', category: 'Model' },
  { path: '/tr/4V0A0308.JPG', title: 'Exhibition Hall Scale 1:100', category: 'Model' },
  { path: '/confrence1.png', title: 'Grand Auditorium & Stage', category: 'Interior' },
  { path: '/home1.png', title: 'Residential Living Suite', category: 'Interior' },
  { path: '/1.jpg', title: 'Spatial Panorama - Main Hall', category: '360 Tour' },
  { path: '/3.jpg', title: 'Spatial Panorama - Penthouse Lounge', category: '360 Tour' },
  { path: '/as.png', title: 'Architectural Concept Render', category: 'Rendering' },
  { path: '/one.png', title: 'Studio Showcase Overview', category: 'Interior' },
  { path: '/ethio1.jpg', title: 'Heritage Villa Restoration', category: 'Architecture' },
  { path: '/ethio 2.jpg', title: 'Vernacular Stone Residence', category: 'Architecture' },
];

export const ImagePickerModal: React.FC<ImagePickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentValue,
  title = 'Select Architectural Asset',
  acceptVideo = false,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'library'>('library');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [customInput, setCustomInput] = useState(currentValue || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['All', 'Interior', 'Model', 'Architecture', '360 Tour', 'Detail'];

  const filteredAssets = STUDIO_PHOTO_ASSETS.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || 
                          item.path.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadError(null);
      const res = await api.uploadFile(file);
      onSelect(res.url);
      onClose();
    } catch (err: any) {
      setUploadError(err.message || 'Device upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-[#132527] border border-white/15 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col z-10 text-white backdrop-blur-xl"
          >
            {/* Hidden device file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptVideo ? "image/*,video/*" : "image/*"}
              onChange={onFileInputChange}
              className="hidden"
            />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-xs">
                  {acceptVideo ? <Film size={18} /> : <ImageIcon size={18} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                      {STUDIO_PHOTO_ASSETS.length} ASSETS
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Select high-res studio photography, drop new uploads, or paste a media link
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="icon-button"
                aria-label="Close modal"
              >
                <X size={17} />
              </button>
            </div>

            {/* Top Action Tabs */}
            <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10">
                <button
                  type="button"
                  onClick={() => setActiveTab('library')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'library'
                      ? 'bg-cyan-900/60 text-cyan-200 border border-cyan-500/30 shadow-xs font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ImageIcon size={14} />
                  <span>Studio Library</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    activeTab === 'upload'
                      ? 'bg-cyan-900/60 text-cyan-200 border border-cyan-500/30 shadow-xs font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Laptop size={14} />
                  <span>Upload from Device</span>
                </button>
              </div>

              {/* Direct Quick Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="primary-button text-xs shadow-xs"
              >
                {isUploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Uploading file...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud size={15} />
                    <span>Browse from Computer</span>
                  </>
                )}
              </button>
            </div>

            {/* Upload Error Banner */}
            {uploadError && (
              <div className="mt-3 p-3 rounded-xl bg-rose-950/60 border border-rose-800/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* TAB 1: UPLOAD FROM DEVICE DROPZONE */}
            {activeTab === 'upload' ? (
              <div className="mt-4 flex-1 flex flex-col justify-center">
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-10 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-cyan-400 bg-cyan-950/40'
                      : 'border-white/15 hover:border-cyan-400/60 bg-black/30 hover:bg-black/40'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-300 mb-3 shadow-xs">
                    {isUploading ? (
                      <Loader2 size={24} className="animate-spin text-cyan-400" />
                    ) : (
                      <UploadCloud size={24} />
                    )}
                  </div>

                  <h4 className="font-display text-base font-semibold text-white mb-1">
                    {isUploading ? 'Uploading file to server...' : 'Drag & drop media files here'}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mb-4">
                    {acceptVideo
                      ? 'Supports high-res architectural images (JPG, PNG, WebP) and videos (MP4, WebM).'
                      : 'Supports high-res architectural photography (JPG, PNG, WebP, SVG).'}
                  </p>

                  <button
                    type="button"
                    disabled={isUploading}
                    className="secondary-button text-xs"
                  >
                    Select file from computer
                  </button>
                </div>
              </div>
            ) : (
              /* TAB 2: CURATED STUDIO LIBRARY & CUSTOM URI */
              <>
                {/* Custom URL Input Bar */}
                <div className="mt-3 p-2 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row gap-2 items-center">
                  <div className="flex-1 w-full flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 focus-within:border-cyan-400">
                    <span className="text-[10px] font-mono text-slate-400 uppercase">URL/Path:</span>
                    <input
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="e.g. /tr/279A1756.JPG or /uploads/... or https://..."
                      className="bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none w-full font-mono"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (customInput.trim()) {
                        onSelect(customInput.trim());
                        onClose();
                      }
                    }}
                    disabled={!customInput.trim()}
                    className="w-full sm:w-auto px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    Apply URI
                  </button>
                </div>

                {/* Search and Category Filter */}
                <div className="mt-3 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        className={`filter-chip text-xs ${
                          activeCategory === cat ? 'filter-chip-active' : ''
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-56">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Filter library..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Grid of Images */}
                <div className="mt-3 flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 min-h-[280px]">
                  {filteredAssets.map((asset) => {
                    const isSelected = currentValue === asset.path;
                    return (
                      <div
                        key={asset.path}
                        onClick={() => {
                          onSelect(asset.path);
                          onClose();
                        }}
                        className={`group relative rounded-xl overflow-hidden border transition-all cursor-pointer bg-black/40 flex flex-col ${
                          isSelected
                            ? 'border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg'
                            : 'border-white/10 hover:border-cyan-400/50 hover:shadow-xs'
                        }`}
                      >
                        <div className="aspect-[4/3] w-full overflow-hidden bg-black/60 relative">
                          <img
                            src={resolveImageUrl(asset.path)}
                            alt={asset.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <span className="absolute top-2 left-2 text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 backdrop-blur-xs border border-cyan-500/30">
                            {asset.category}
                          </span>
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold shadow-xs">
                              <Check size={12} strokeWidth={3} />
                            </div>
                          )}
                        </div>
                        <div className="p-2.5">
                          <p className="text-xs font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
                            {asset.title}
                          </p>
                          <p className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                            {asset.path}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* Footer */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="font-mono text-[10px] uppercase">Roha Architectural Photography Archive</span>
              <button
                type="button"
                onClick={onClose}
                className="secondary-button text-xs"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ImagePickerModal;
