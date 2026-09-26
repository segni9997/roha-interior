import React, { useState, useRef, useCallback } from 'react';
import {
  UploadCloud,
  Star,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Loader2,
  AlertCircle,
  FolderPlus,
  RefreshCw,
  Layers
} from 'lucide-react';
import { api, resolveImageUrl, type GalleryImageItem } from '../../services/api';
import { ImagePickerModal } from './ImagePickerModal';

export interface MediaGalleryManagerProps {
  mainImage: string | null;
  onMainImageChange: (url: string | null) => void;
  galleryImages: GalleryImageItem[];
  onGalleryImagesChange: (images: GalleryImageItem[]) => void;
  contentTypeLabel?: string;
  onDeleteServerImage?: (imageId: number) => Promise<void>;
  onAddServerImage?: (data: { image: string; caption?: string; subtitle?: string; order?: number }) => Promise<GalleryImageItem>;
  allowCaptions?: boolean;
}

export const MediaGalleryManager: React.FC<MediaGalleryManagerProps> = ({
  mainImage,
  onMainImageChange,
  galleryImages = [],
  onGalleryImagesChange,
  contentTypeLabel = 'Content Item',
  onDeleteServerImage,
  onAddServerImage,
  allowCaptions = true,
}) => {
  // Drag and drop states
  const [isDraggingMain, setIsDraggingMain] = useState(false);
  const [isDraggingGallery, setIsDraggingGallery] = useState(false);

  // File input refs
  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const multiFileInputRef = useRef<HTMLInputElement>(null);

  // Uploading and progress states
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number; filename: string } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Studio Asset Picker modal state
  const [pickerTarget, setPickerTarget] = useState<'main' | 'gallery' | null>(null);

  // Fullscreen preview lightbox
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  /* -------------------------------------------------------------
     1. MAIN IMAGE HANDLERS
  ------------------------------------------------------------- */
  const handleMainFileUpload = async (files: FileList | File[]) => {
    const file = files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    try {
      setUploadingMain(true);
      setUploadError(null);
      const res = await api.uploadFile(file);
      onMainImageChange(res.url);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload Main Image.');
    } finally {
      setUploadingMain(false);
      if (mainFileInputRef.current) mainFileInputRef.current.value = '';
    }
  };

  const handleSetAsMain = (imageUrl: string) => {
    onMainImageChange(imageUrl);
  };

  const handleClearMain = () => {
    onMainImageChange(null);
  };

  /* -------------------------------------------------------------
     2. MULTI-FILE GALLERY UPLOAD HANDLERS
  ------------------------------------------------------------- */
  const handleMultiFileUpload = async (filesList: FileList | File[]) => {
    const files = Array.from(filesList).filter(f => f.type.startsWith('image/'));
    if (files.length === 0) {
      setUploadError('Please select valid image files.');
      return;
    }

    try {
      setUploadingGallery(true);
      setUploadError(null);

      const newlyAdded: GalleryImageItem[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress({ current: i + 1, total: files.length, filename: file.name });
        const uploadRes = await api.uploadFile(file);

        const newItem: GalleryImageItem = {
          id: Date.now() + i + Math.floor(Math.random() * 1000),
          image: uploadRes.url,
          caption: '',
          subtitle: 'Detail View',
          order: galleryImages.length + i + 1,
        };

        if (onAddServerImage) {
          try {
            const serverItem = await onAddServerImage({
              image: newItem.image,
              caption: newItem.caption,
              subtitle: newItem.subtitle,
              order: newItem.order,
            });
            newlyAdded.push(serverItem);
          } catch {
            newlyAdded.push(newItem);
          }
        } else {
          newlyAdded.push(newItem);
        }
      }

      const updated = [...galleryImages, ...newlyAdded];
      onGalleryImagesChange(updated);

      // If no Main Image is set yet, automatically assign the first uploaded image as Main Image
      if (!mainImage && newlyAdded.length > 0) {
        onMainImageChange(newlyAdded[0].image);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Gallery upload failed.');
    } finally {
      setUploadingGallery(false);
      setUploadProgress(null);
      if (multiFileInputRef.current) multiFileInputRef.current.value = '';
    }
  };

  /* -------------------------------------------------------------
     3. GALLERY REORDER & REMOVE
  ------------------------------------------------------------- */
  const handleMoveGalleryItem = (index: number, direction: 'left' | 'right' | 'up' | 'down') => {
    const isBack = direction === 'left' || direction === 'up';
    const targetIdx = isBack ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= galleryImages.length) return;

    const list = [...galleryImages];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    // Recalculate order indices
    list.forEach((img, i) => {
      img.order = i + 1;
    });

    onGalleryImagesChange(list);
  };

  const handleRemoveGalleryItem = async (index: number) => {
    const itemToRemove = galleryImages[index];
    if (!itemToRemove) return;

    // If server delete callback is provided and id is not a local temp timestamp
    if (onDeleteServerImage && itemToRemove.id && itemToRemove.id < 1000000000) {
      try {
        await onDeleteServerImage(itemToRemove.id);
      } catch (err) {
        console.warn('Server delete failed, removing locally:', err);
      }
    }

    const updated = galleryImages.filter((_, i) => i !== index);
    onGalleryImagesChange(updated);
  };

  const handleUpdateItemField = (index: number, field: 'caption' | 'subtitle', val: string) => {
    const list = [...galleryImages];
    list[index] = { ...list[index], [field]: val };
    onGalleryImagesChange(list);
  };

  /* -------------------------------------------------------------
     4. DRAG AND DROP LISTENERS
  ------------------------------------------------------------- */
  const onDragOverMain = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingMain(true);
  }, []);

  const onDragLeaveMain = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingMain(false);
  }, []);

  const onDropMain = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingMain(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleMainFileUpload(e.dataTransfer.files);
    }
  }, []);

  const onDragOverGallery = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingGallery(true);
  }, []);

  const onDragLeaveGallery = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingGallery(false);
  }, []);

  const onDropGallery = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingGallery(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleMultiFileUpload(e.dataTransfer.files);
    }
  }, [galleryImages, mainImage]);

  return (
    <div className="space-y-8 select-none">
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={mainFileInputRef}
        onChange={(e) => e.target.files && handleMainFileUpload(e.target.files)}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={multiFileInputRef}
        onChange={(e) => e.target.files && handleMultiFileUpload(e.target.files)}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* Upload Error Banner */}
      {uploadError && (
        <div className="flex items-center justify-between p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={16} className="text-rose-400 shrink-0" />
            <span>{uploadError}</span>
          </div>
          <button onClick={() => setUploadError(null)} className="text-rose-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* -------------------------------------------------------------
          SECTION 1: MAIN IMAGE (PRIMARY / COVER VISUAL)
      ------------------------------------------------------------- */}
      <div className="bg-[#0b1214] border border-slate-800/90 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37]">
              <Star size={16} className="fill-[#d4af37]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Main Image (Cover)</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#172e31] text-cyan-300 border border-[#205b63]">
                  PRIMARY LISTING & HERO
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                The primary visual for {contentTypeLabel.toLowerCase()} cards, listing grids, and the hero section on the public detail page.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => mainFileInputRef.current?.click()}
              disabled={uploadingMain}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#172e31] hover:bg-[#205b63] text-cyan-300 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider border border-[#205b63] transition-all cursor-pointer"
            >
              {uploadingMain ? <Loader2 size={13} className="animate-spin" /> : <UploadCloud size={13} />}
              <span>{mainImage ? 'Replace Image' : 'Upload Main Image'}</span>
            </button>
            <button
              type="button"
              onClick={() => setPickerTarget('main')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider border border-slate-700/60 transition-all cursor-pointer"
            >
              <FolderPlus size={13} />
              <span>Studio Assets</span>
            </button>
          </div>
        </div>

        {/* Main Image Drop Area / Preview */}
        {mainImage ? (
          <div className="relative group rounded-xl overflow-hidden border border-[#d4af37]/40 bg-black/60 shadow-lg">
            <div className="relative h-56 sm:h-72 w-full flex items-center justify-center bg-black/80 overflow-hidden">
              <img
                src={resolveImageUrl(mainImage)}
                alt="Main Cover"
                className="w-full h-full object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

              {/* Status Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#d4af37] text-slate-950 font-black text-[10px] uppercase tracking-wider shadow-md">
                <Star size={12} className="fill-slate-950" />
                <span>Selected Main Image</span>
              </div>

              {/* Action Overlays */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => mainFileInputRef.current?.click()}
                  title="Replace with Local File"
                  className="p-2 rounded-lg bg-black/80 hover:bg-[#205b63] text-white border border-slate-700 hover:border-cyan-400 text-xs transition-all shadow-lg cursor-pointer"
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleClearMain}
                  title="Remove Main Image"
                  className="p-2 rounded-lg bg-black/80 hover:bg-rose-600 text-rose-300 hover:text-white border border-slate-700 hover:border-rose-500 text-xs transition-all shadow-lg cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Info Pill */}
              <div className="absolute bottom-3 left-3 text-[10px] font-mono text-slate-300 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded border border-slate-800">
                {mainImage.split('/').pop() || 'main_cover.jpg'}
              </div>
            </div>
          </div>
        ) : (
          <div
            onDragOver={onDragOverMain}
            onDragLeave={onDragLeaveMain}
            onDrop={onDropMain}
            onClick={() => mainFileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
              isDraggingMain
                ? 'border-[#d4af37] bg-[#d4af37]/10 scale-[1.01]'
                : 'border-slate-800 hover:border-[#d4af37]/50 bg-black/30 hover:bg-black/50'
            }`}
          >
            {uploadingMain ? (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <Loader2 size={28} className="animate-spin text-[#d4af37]" />
                <span className="text-xs font-mono">Uploading cover image...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] mb-1">
                  <Star size={24} />
                </div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">
                  Drag & Drop Main Cover Photo Here
                </p>
                <p className="text-[11px] text-slate-400">
                  or click to select from your computer (JPG, PNG, WEBP)
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------
          SECTION 2: MULTI-IMAGE GALLERY UPLOAD & REORDER GRID
      ------------------------------------------------------------- */}
      <div className="bg-[#0b1214] border border-slate-800/90 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800/60">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#205b63]/20 border border-[#205b63]/40 text-cyan-300">
              <Layers size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black uppercase tracking-wider text-white">Gallery Images</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#172e31] text-cyan-300 border border-[#205b63]">
                  {galleryImages.length} {galleryImages.length === 1 ? 'PHOTO' : 'PHOTOS'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Upload multiple images at once. Reorder, select a Main Image, or add captions.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => multiFileInputRef.current?.click()}
              disabled={uploadingGallery}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#172e31] to-[#205b63] hover:from-[#1b373b] hover:to-[#266e77] text-white rounded-lg text-xs font-bold uppercase tracking-wider border border-[#2d7882] shadow-md shadow-teal-950/30 transition-all cursor-pointer"
            >
              {uploadingGallery ? <Loader2 size={13} className="animate-spin" /> : <UploadCloud size={13} />}
              <span>Upload Multiple Images</span>
            </button>
            <button
              type="button"
              onClick={() => setPickerTarget('gallery')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider border border-slate-700/60 transition-all cursor-pointer"
            >
              <FolderPlus size={13} />
              <span>Studio Assets</span>
            </button>
          </div>
        </div>

        {/* Multi-File Drag & Drop Area */}
        <div
          onDragOver={onDragOverGallery}
          onDragLeave={onDragLeaveGallery}
          onDrop={onDropGallery}
          onClick={() => multiFileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer ${
            isDraggingGallery
              ? 'border-cyan-400 bg-[#205b63]/20 scale-[1.01]'
              : 'border-slate-800/80 hover:border-cyan-500/50 bg-black/20 hover:bg-black/40'
          }`}
        >
          {uploadingGallery && uploadProgress ? (
            <div className="flex flex-col items-center gap-2.5 w-full max-w-sm">
              <Loader2 size={24} className="animate-spin text-cyan-400" />
              <div className="flex justify-between text-xs w-full text-slate-300 font-mono">
                <span>Uploading {uploadProgress.current} of {uploadProgress.total}</span>
                <span>{Math.round((uploadProgress.current / uploadProgress.total) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 to-[#d4af37] transition-all duration-300"
                  style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 truncate max-w-xs">{uploadProgress.filename}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center gap-1.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-center text-cyan-300 mb-1">
                <UploadCloud size={20} />
              </div>
              <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Drag & Drop Multiple Gallery Photos Here
              </p>
              <p className="text-[11px] text-slate-400">
                You can select dozens of images at once from your local computer files
              </p>
            </div>
          )}
        </div>

        {/* Gallery Grid */}
        {galleryImages.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 pt-2">
            {galleryImages.map((item, index) => {
              const isSelectedMain = mainImage === item.image;
              return (
                <div
                  key={item.id || index}
                  className={`group relative rounded-xl overflow-hidden bg-[#0e1719] border transition-all duration-200 flex flex-col justify-between ${
                    isSelectedMain
                      ? 'border-[#d4af37] ring-2 ring-[#d4af37]/40 shadow-lg shadow-amber-950/30'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video sm:aspect-square w-full bg-black/60 overflow-hidden">
                    <img
                      src={resolveImageUrl(item.image)}
                      alt={item.caption || `Gallery ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-70 group-hover:opacity-90 transition-opacity" />

                    {/* Order Index Pill */}
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-slate-300 border border-slate-700/60">
                      #{index + 1}
                    </div>

                    {/* Active Main Badge OR Set as Main Button */}
                    {isSelectedMain ? (
                      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#d4af37] text-slate-950 text-[9px] font-black uppercase tracking-wider shadow-md">
                        <Star size={10} className="fill-slate-950" />
                        <span>MAIN</span>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetAsMain(item.image);
                        }}
                        title="Set this image as Main Cover"
                        className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/70 hover:bg-[#d4af37] text-slate-300 hover:text-slate-950 text-[9px] font-bold uppercase tracking-wider border border-slate-700 hover:border-transparent opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-md"
                      >
                        <Star size={10} />
                        <span>Make Main</span>
                      </button>
                    )}

                    {/* Bottom Action Bar */}
                    <div className="absolute bottom-2 inset-x-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveGalleryItem(index, 'left');
                          }}
                          title="Move Left"
                          className="p-1 rounded bg-black/80 hover:bg-[#205b63] text-white disabled:opacity-30 disabled:hover:bg-black/80 text-xs border border-slate-700 cursor-pointer"
                        >
                          <ChevronLeft size={12} />
                        </button>
                        <button
                          type="button"
                          disabled={index === galleryImages.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoveGalleryItem(index, 'right');
                          }}
                          title="Move Right"
                          className="p-1 rounded bg-black/80 hover:bg-[#205b63] text-white disabled:opacity-30 disabled:hover:bg-black/80 text-xs border border-slate-700 cursor-pointer"
                        >
                          <ChevronRight size={12} />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setLightboxIndex(index)}
                          title="Zoom / Inspect"
                          className="p-1 rounded bg-black/80 hover:bg-cyan-600 text-white text-xs border border-slate-700 cursor-pointer"
                        >
                          <Maximize2 size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryItem(index)}
                          title="Remove Photo"
                          className="p-1 rounded bg-black/80 hover:bg-rose-600 text-rose-300 hover:text-white text-xs border border-slate-700 cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Caption & Subtitle Bar */}
                  {allowCaptions && (
                    <div className="p-2 space-y-1.5 bg-[#0b1214] border-t border-slate-800">
                      <input
                        type="text"
                        value={item.caption || ''}
                        onChange={(e) => handleUpdateItemField(index, 'caption', e.target.value)}
                        placeholder="Caption (e.g. Master Suite Joinery)"
                        className="w-full text-[11px] bg-black/40 border border-slate-800/80 rounded px-2 py-1 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center text-slate-500 text-xs font-mono">
            No gallery images uploaded yet. Drag & drop photos above to build this gallery.
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------
          STUDIO ASSET PICKER MODAL
      ------------------------------------------------------------- */}
      {pickerTarget && (
        <ImagePickerModal
          isOpen={true}
          onClose={() => setPickerTarget(null)}
          onSelect={(url) => {
            if (pickerTarget === 'main') {
              onMainImageChange(url);
            } else if (pickerTarget === 'gallery') {
              const newItem: GalleryImageItem = {
                id: Date.now(),
                image: url,
                caption: '',
                subtitle: 'Studio Asset',
                order: galleryImages.length + 1,
              };
              onGalleryImagesChange([...galleryImages, newItem]);
            }
            setPickerTarget(null);
          }}
          currentValue={pickerTarget === 'main' ? (mainImage || '') : ''}
          title={pickerTarget === 'main' ? 'Select Main Cover Photo' : 'Add Photo to Gallery'}
        />
      )}

      {/* -------------------------------------------------------------
          LIGHTBOX MODAL
      ------------------------------------------------------------- */}
      {lightboxIndex !== null && galleryImages[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none"
          onClick={() => setLightboxIndex(null)}
        >
          <div className="relative max-w-5xl w-full h-[80vh] flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={resolveImageUrl(galleryImages[lightboxIndex].image)}
              alt="Lightbox"
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl border border-slate-800"
            />

            {/* Lightbox Controls */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-2 right-2 p-2 rounded-full bg-black/70 text-white hover:bg-rose-600 transition-colors"
            >
              <X size={20} />
            </button>

            {lightboxIndex > 0 && (
              <button
                onClick={() => setLightboxIndex(lightboxIndex - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 text-white hover:bg-[#205b63] transition-colors"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {lightboxIndex < galleryImages.length - 1 && (
              <button
                onClick={() => setLightboxIndex(lightboxIndex + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 text-white hover:bg-[#205b63] transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            )}

            {/* Lightbox Bottom Info */}
            <div className="mt-4 flex items-center justify-between w-full px-4 text-xs font-mono text-slate-300">
              <span>Photo {lightboxIndex + 1} of {galleryImages.length}</span>
              <span className="text-[#d4af37]">
                {mainImage === galleryImages[lightboxIndex].image ? '★ CURRENT MAIN IMAGE' : ''}
              </span>
              <button
                type="button"
                onClick={() => {
                  handleSetAsMain(galleryImages[lightboxIndex].image);
                }}
                className="px-3 py-1 rounded bg-[#172e31] hover:bg-[#205b63] text-cyan-300 text-xs font-bold uppercase tracking-wider border border-[#205b63]"
              >
                Set as Main Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
