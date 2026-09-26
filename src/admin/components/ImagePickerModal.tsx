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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c1315] border border-[#172e31] rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col z-10 text-white"
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
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#172e31] border border-[#205b63] flex items-center justify-center text-cyan-300 shadow-sm">
                  {acceptVideo ? <Film size={20} /> : <ImageIcon size={20} />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold tracking-tight text-white">{title}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#172e31] text-[#d4af37]">
                      {STUDIO_PHOTO_ASSETS.length} ASSETS
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Upload from local device, select studio photography, or input custom URI
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Top Action Tabs: Upload from Device vs Curated Library */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 p-1 rounded-2xl bg-[#080d0e] border border-slate-800/90">
                <button
                  type="button"
                  onClick={() => setActiveTab('library')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'library'
                      ? 'bg-[#172e31] text-cyan-200 border border-[#2d7882] shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ImageIcon size={14} />
                  <span>Studio Library</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === 'upload'
                      ? 'bg-[#205b63] text-white border border-cyan-400/50 shadow-sm'
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
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#205b63] to-[#2d7882] hover:from-[#17484e] hover:to-[#205b63] text-white text-xs font-bold uppercase tracking-wider border border-cyan-400/40 shadow-lg shadow-cyan-950/40 transition-all cursor-pointer disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 size={14} className="animate-spin text-cyan-300" />
                    <span>Uploading...</span>
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
              <div className="mt-3 p-3 rounded-xl bg-red-950/50 border border-red-800/80 text-red-300 text-xs flex items-center gap-2">
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
                  className={`p-10 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-cyan-400 bg-[#205b63]/20 scale-[1.01]'
                      : 'border-slate-700/80 hover:border-[#205b63] bg-[#080d0e]/60 hover:bg-[#080d0e]'
                  }`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-[#172e31] border border-[#205b63] flex items-center justify-center text-cyan-300 mb-4 shadow-inner">
                    {isUploading ? (
                      <Loader2 size={30} className="animate-spin text-cyan-300" />
                    ) : (
                      <UploadCloud size={30} />
                    )}
                  </div>

                  <h4 className="text-base font-bold text-white mb-1">
                    {isUploading ? 'Uploading file from your computer...' : 'Select or Drop Files from Your Device'}
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mb-4">
                    {acceptVideo
                      ? 'Supports high-res architectural images (JPG, PNG, WebP) and cinematic videos (MP4, WebM).'
                      : 'Supports high-res architectural photography (JPG, PNG, WebP, SVG).'}
                  </p>

                  <button
                    type="button"
                    disabled={isUploading}
                    className="px-6 py-2.5 rounded-xl bg-[#205b63] hover:bg-[#17484e] text-white text-xs font-bold uppercase tracking-wider border border-cyan-400/40 shadow-md transition-colors"
                  >
                    Browse Device Storage
                  </button>
                </div>
              </div>
            ) : (
              /* TAB 2: CURATED STUDIO LIBRARY & CUSTOM URI */
              <>
                {/* Custom URL Input Bar */}
                <div className="mt-3 p-2.5 rounded-2xl bg-[#080d0e] border border-slate-800/80 flex flex-col sm:flex-row gap-2.5 items-center">
                  <div className="flex-1 w-full flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-slate-800 focus-within:border-[#205b63]">
                    <span className="text-[11px] font-mono text-slate-500 uppercase">URI:</span>
                    <input
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder="e.g. /tr/279A1756.JPG or /uploads/... or https://..."
                      className="bg-transparent text-xs text-white placeholder:text-slate-600 focus:outline-none w-full font-mono"
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
                    className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#172e31] hover:bg-[#205b63] disabled:opacity-40 text-xs font-bold uppercase tracking-wider text-cyan-200 border border-[#2d7882] transition-colors cursor-pointer"
                  >
                    Apply Custom URI
                  </button>
                </div>

                {/* Search and Category Filter */}
                <div className="mt-3 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer ${
                          activeCategory === cat
                            ? 'bg-[#205b63] text-white border border-cyan-400/40 shadow-sm'
                            : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="relative w-full sm:w-60">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search assets..."
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:border-[#205b63] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Grid of Images */}
                <div className="mt-3 flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 min-h-[300px]">
                  {filteredAssets.map((asset) => {
                    const isSelected = currentValue === asset.path;
                    return (
                      <div
                        key={asset.path}
                        onClick={() => {
                          onSelect(asset.path);
                          onClose();
                        }}
                        className={`group relative rounded-2xl overflow-hidden border transition-all cursor-pointer bg-[#080d0e] flex flex-col ${
                          isSelected
                            ? 'border-[#d4af37] ring-2 ring-[#d4af37]/40 shadow-lg shadow-amber-950/30'
                            : 'border-slate-800/80 hover:border-[#205b63] hover:shadow-md'
                        }`}
                      >
                        <div className="aspect-[4/3] w-full overflow-hidden bg-slate-900 relative">
                          <img
                            src={resolveImageUrl(asset.path)}
                            alt={asset.title}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <span className="absolute top-2 left-2 text-[9px] font-mono px-2 py-0.5 rounded-md bg-black/75 text-cyan-300 backdrop-blur-sm">
                            {asset.category}
                          </span>
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#d4af37] text-black flex items-center justify-center font-bold shadow-md">
                              <Check size={14} />
                            </div>
                          )}
                        </div>
                        <div className="p-2.5">
                          <p className="text-[11px] font-bold text-slate-200 truncate group-hover:text-white">
                            {asset.title}
                          </p>
                          <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
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
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono text-[11px]">ARCHITECTURAL ASSET VAULT</span>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ImagePickerModal;

