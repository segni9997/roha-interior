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
      const newItems: GalleryImageItem[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadProgress({ current: i + 1, total: files.length, filename: file.name });

        if (onAddServerImage) {
          const res = await api.uploadFile(file);
          const created = await onAddServerImage({
            image: res.url,
            caption: file.name.replace(/\.[^/.]+$/, ''),
            order: galleryImages.length + i + 1,
          });
          newItems.push(created);
        } else {
          const res = await api.uploadFile(file);
          newItems.push({
            id: Date.now() + i,
            image: res.url,
            caption: file.name.replace(/\.[^/.]+$/, ''),
            subtitle: 'Gallery Detail',
            order: galleryImages.length + i + 1,
          });
        }
      }

      onGalleryImagesChange([...galleryImages, ...newItems]);

      if (!mainImage && newItems.length > 0) {
        onMainImageChange(newItems[0].image);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload gallery images.');
    } finally {
      setUploadingGallery(false);
      setUploadProgress(null);
      if (multiFileInputRef.current) multiFileInputRef.current.value = '';
    }
  };

  /* -------------------------------------------------------------
     3. GALLERY REORDER & FIELD UPDATE HANDLERS
  ------------------------------------------------------------- */
  const handleMoveGalleryItem = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= galleryImages.length) return;

    const copy = [...galleryImages];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    const reordered = copy.map((item, idx) => ({ ...item, order: idx + 1 }));
    onGalleryImagesChange(reordered);
  };

  const handleUpdateItemField = (index: number, field: 'caption' | 'subtitle', value: string) => {
    const copy = [...galleryImages];
    copy[index] = { ...copy[index], [field]: value };
    onGalleryImagesChange(copy);
  };

  const handleRemoveGalleryItem = async (index: number) => {
    const target = galleryImages[index];
    if (target.id && onDeleteServerImage) {
      try {
        await onDeleteServerImage(target.id);
      } catch (err: any) {
        setUploadError(`Failed to delete image: ${err.message}`);
        return;
      }
    }

    const updated = galleryImages.filter((_, idx) => idx !== index);
    onGalleryImagesChange(updated);
  };

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
    <div className="space-y-6">
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
        <div className="flex items-center justify-between p-3.5 bg-rose-950/60 border border-rose-800/40 rounded-xl text-xs text-rose-300">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={16} className="text-rose-400 shrink-0" />
            <span>{uploadError}</span>
          </div>
          <button onClick={() => setUploadError(null)} className="text-rose-400 hover:text-rose-200">
            <X size={14} />
          </button>
        </div>
      )}

      {/* -------------------------------------------------------------
          SECTION 1: MAIN IMAGE (PRIMARY / COVER VISUAL)
      ------------------------------------------------------------- */}
      <div className="bg-[#132527] border border-white/15 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
              <Star size={16} className="fill-cyan-400 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-semibold text-white">Main Cover Photograph</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                  PRIMARY HERO
                </span>
              </div>
              <p className="text-xs text-slate-400">
                The key visual for {contentTypeLabel.toLowerCase()} showcase cards, grids, and header banners.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => mainFileInputRef.current?.click()}
              disabled={uploadingMain}
              className="secondary-button text-xs"
            >
              {uploadingMain ? <Loader2 size={13} className="animate-spin" /> : <UploadCloud size={13} />}
              <span>{mainImage ? 'Replace Cover' : 'Upload Cover'}</span>
            </button>
            <button
              type="button"
              onClick={() => setPickerTarget('main')}
              className="secondary-button text-xs"
            >
              <FolderPlus size={13} />
              <span>Studio Assets</span>
            </button>
          </div>
        </div>

        {/* Main Image Drop Area / Preview */}
        {mainImage ? (
          <div className="relative group rounded-xl overflow-hidden border border-white/15 bg-black/40 shadow-xs">
            <div className="relative h-56 sm:h-72 w-full flex items-center justify-center bg-black/60 overflow-hidden">
              <img
                src={resolveImageUrl(mainImage)}
                alt="Main Cover"
                className="w-full h-full object-contain object-center transition-transform duration-300 group-hover:scale-[1.01]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

              {/* Status Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-950/90 backdrop-blur-xs text-cyan-300 font-bold text-[10px] uppercase tracking-wider shadow-xs border border-cyan-500/30">
                <Star size={11} className="fill-cyan-400 text-cyan-400" />
                <span>Primary Cover</span>
              </div>

              {/* Action Overlays */}
              <div className="absolute bottom-3 right-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => mainFileInputRef.current?.click()}
                  title="Replace with Local File"
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs transition-all shadow-md cursor-pointer border border-white/20"
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleClearMain}
                  title="Remove Main Image"
                  className="p-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs transition-all shadow-md cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Info Pill */}
              <div className="absolute bottom-3 left-3 text-[11px] font-mono text-white/90 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/15">
                {mainImage.split('/').pop() || 'cover_photo.jpg'}
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
                ? 'border-cyan-400 bg-cyan-950/40'
                : 'border-white/15 hover:border-cyan-400/60 bg-black/30 hover:bg-black/40'
            }`}
          >
            {uploadingMain ? (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <Loader2 size={24} className="animate-spin text-cyan-400" />
                <span className="text-xs font-mono">Uploading cover image...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center gap-1.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-300 mb-1 shadow-xs">
                  <Star size={18} />
                </div>
                <p className="text-xs font-semibold text-white uppercase tracking-wider">
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
      <div className="bg-[#132527] border border-white/15 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 text-cyan-300">
              <Layers size={16} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-semibold text-white">Project Gallery Archive</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                  {galleryImages.length} {galleryImages.length === 1 ? 'PHOTO' : 'PHOTOS'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Upload multiple high-res angles, details, and sections. Drag to reorder or set cover.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => multiFileInputRef.current?.click()}
              disabled={uploadingGallery}
              className="primary-button text-xs shadow-xs"
            >
              {uploadingGallery ? <Loader2 size={13} className="animate-spin" /> : <UploadCloud size={13} />}
              <span>Upload Multiple Photos</span>
            </button>
            <button
              type="button"
              onClick={() => setPickerTarget('gallery')}
              className="secondary-button text-xs"
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
              ? 'border-cyan-400 bg-cyan-950/40'
              : 'border-white/15 hover:border-cyan-400/60 bg-black/30 hover:bg-black/40'
          }`}
        >
          {uploadingGallery && uploadProgress ? (
            <div className="flex flex-col items-center gap-2.5 w-full max-w-sm">
              <Loader2 size={24} className="animate-spin text-cyan-400" />
              <div className="flex justify-between text-xs w-full text-slate-300 font-mono">
                <span>Uploading {uploadProgress.current} of {uploadProgress.total}</span>
                <span>{Math.round((uploadProgress.current / uploadProgress.total) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all duration-300"
                  style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 truncate max-w-xs">{uploadProgress.filename}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center gap-1.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-300 mb-1 shadow-xs">
                <UploadCloud size={18} />
              </div>
              <p className="text-xs font-semibold text-white uppercase tracking-wider">
                Drag & Drop Multiple Gallery Photos Here
              </p>
              <p className="text-[11px] text-slate-400">
                Batch select architectural photography from your computer
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
                  className={`group relative rounded-xl overflow-hidden bg-black/40 border transition-all duration-200 flex flex-col justify-between ${
                    isSelectedMain
                      ? 'border-cyan-400 ring-2 ring-cyan-400/30 shadow-md'
                      : 'border-white/10 hover:border-cyan-400/50 shadow-xs'
                  }`}
                >
                  {/* Thumbnail Container */}
                  <div className="relative aspect-video sm:aspect-square w-full bg-black/60 overflow-hidden">
                    <img
                      src={resolveImageUrl(item.image)}
                      alt={item.caption || `Gallery ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-90 transition-opacity" />

                    {/* Order Index Pill */}
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-xs text-[10px] font-mono text-white border border-white/20">
                      #{index + 1}
                    </div>

                    {/* Active Main Badge OR Set as Main Button */}
                    {isSelectedMain ? (
                      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-600 text-white text-[9px] font-bold uppercase tracking-wider shadow-xs">
                        <Star size={10} className="fill-white text-white" />
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
                        className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/80 hover:bg-cyan-600 text-white text-[9px] font-semibold uppercase tracking-wider border border-white/20 opacity-0 group-hover:opacity-100 transition-all cursor-pointer shadow-xs"
                      >
                        <Star size={10} />
                        <span>Make Cover</span>
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
                          className="p-1 rounded bg-black/80 hover:bg-white hover:text-black text-white disabled:opacity-30 text-xs border border-white/20 cursor-pointer"
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
                          className="p-1 rounded bg-black/80 hover:bg-white hover:text-black text-white disabled:opacity-30 text-xs border border-white/20 cursor-pointer"
                        >
                          <ChevronRight size={12} />
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setLightboxIndex(index)}
                          title="Zoom / Inspect"
                          className="p-1 rounded bg-black/80 hover:bg-white hover:text-black text-white text-xs border border-white/20 cursor-pointer"
                        >
                          <Maximize2 size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveGalleryItem(index)}
                          title="Remove Photo"
                          className="p-1 rounded bg-rose-700 hover:bg-rose-800 text-white text-xs border border-rose-600 cursor-pointer"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Caption Bar */}
                  {allowCaptions && (
                    <div className="p-2 space-y-1 bg-black/40 border-t border-white/10">
                      <input
                        type="text"
                        value={item.caption || ''}
                        onChange={(e) => handleUpdateItemField(index, 'caption', e.target.value)}
                        placeholder="Caption (e.g. Master Suite Joinery)"
                        className="w-full text-xs bg-black/50 border border-white/10 rounded px-2 py-1 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center text-slate-400 text-xs">
            No gallery images uploaded yet. Drop photos above to build this gallery.
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
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none"
          onClick={() => setLightboxIndex(null)}
        >
          <div className="relative max-w-5xl w-full h-[80vh] flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={resolveImageUrl(galleryImages[lightboxIndex].image)}
              alt="Lightbox"
              className="max-h-full max-w-full object-contain rounded-xl shadow-2xl border border-white/20"
            />

            {/* Lightbox Controls */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="icon-button absolute top-2 right-2 bg-black/60 text-white hover:bg-black"
            >
              <X size={18} />
            </button>

            {lightboxIndex > 0 && (
              <button
                onClick={() => setLightboxIndex(lightboxIndex - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {lightboxIndex < galleryImages.length - 1 && (
              <button
                onClick={() => setLightboxIndex(lightboxIndex + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 text-white hover:bg-black transition-colors cursor-pointer"
              >
                <ChevronRight size={24} />
              </button>
            )}

            {/* Lightbox Bottom Info */}
            <div className="mt-4 flex items-center justify-between w-full px-4 text-xs font-mono text-white">
              <span>Photo {lightboxIndex + 1} of {galleryImages.length}</span>
              <span className="text-cyan-400">
                {mainImage === galleryImages[lightboxIndex].image ? '★ CURRENT COVER' : ''}
              </span>
              <button
                type="button"
                onClick={() => {
                  handleSetAsMain(galleryImages[lightboxIndex].image);
                }}
                className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold uppercase tracking-wider cursor-pointer"
              >
                Set as Cover
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
