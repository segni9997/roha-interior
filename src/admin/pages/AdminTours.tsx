import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Move3D,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Layers,
  Compass,
  X,
  Eye,
  Loader2,
  Image as ImageIcon,
  MapPin,
  Upload,
  Maximize2,
  Minimize2
} from 'lucide-react';
import {
  api,
  resolveImageUrl,
  type PanoramicTourItem,
  type PanoramicSceneItem,
  type GalleryImageItem,
} from '../../services/api';
import { ConfirmModal } from '../components/ConfirmModal';
import { Toast, type ToastType } from '../components/Toast';
import { ImagePickerModal } from '../components/ImagePickerModal';
import { MediaGalleryManager } from '../components/MediaGalleryManager';

export const AdminTours: React.FC = () => {
  const [tours, setTours] = useState<PanoramicTourItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Tour Edit/Create Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<PanoramicTourItem | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCoverImage, setFormCoverImage] = useState('');
  const [formGalleryImages, setFormGalleryImages] = useState<GalleryImageItem[]>([]);
  const [formIsFeatured, setFormIsFeatured] = useState(true);
  const [saving, setSaving] = useState(false);

  // Live Preview Mode State
  const [previewLayout, setPreviewLayout] = useState<'split' | 'form' | 'preview'>('split');
  const [previewTab, setPreviewTab] = useState<'card' | 'panorama'>('card');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Scenes Management Drawer/Modal State
  const [selectedTourForScenes, setSelectedTourForScenes] = useState<PanoramicTourItem | null>(null);
  const [newSceneName, setNewSceneName] = useState('');
  const [newScenePanorama, setNewScenePanorama] = useState('/1.jpg');
  const [newSceneYaw, setNewSceneYaw] = useState<number>(180);
  const [newScenePitch, setNewScenePitch] = useState<number>(0);
  const [addingScene, setAddingScene] = useState(false);

  // Asset Picker State
  const [imagePickerTarget, setImagePickerTarget] = useState<'tour_cover' | 'scene_panorama' | null>(null);
  const sceneFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingSceneImg, setUploadingSceneImg] = useState(false);

  // Confirm Delete
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'tour' | 'scene'; id: number; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const handleSceneUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingSceneImg(true);
      const res = await api.uploadFile(file);
      setNewScenePanorama(res.url);
      setToast({ message: `Panorama uploaded: ${file.name}`, type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message || 'Panorama upload failed', type: 'error' });
    } finally {
      setUploadingSceneImg(false);
      if (e.target) e.target.value = '';
    }
  };

  useEffect(() => {
    loadTours();
  }, []);

  const loadTours = async () => {
    try {
      setLoading(true);
      const data = await api.getPanoramicTours();
      setTours(data);
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to fetch panoramic tours', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingTour(null);
    setFormTitle('');
    setFormSlug('');
    setFormDescription('');
    setFormCoverImage('/1.jpg');
    setFormGalleryImages([]);
    setFormIsFeatured(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (tour: PanoramicTourItem) => {
    setEditingTour(tour);
    setFormTitle(tour.title);
    setFormSlug(tour.slug);
    setFormDescription(tour.description || '');
    setFormCoverImage(tour.cover_image || '');
    setFormGalleryImages(tour.gallery_images || []);
    setFormIsFeatured(tour.is_featured);
    setIsModalOpen(true);
  };

  const handleAddServerGalleryImage = async (data: Partial<GalleryImageItem>): Promise<GalleryImageItem> => {
    if (!editingTour) throw new Error('Tour not saved yet');
    const res = await api.addTourGalleryImage(editingTour.id, {
      image: data.image || '',
      caption: data.caption,
      subtitle: data.subtitle,
      order: data.order || 0,
    });
    return res;
  };

  const handleDeleteServerGalleryImage = async (id: number | string) => {
    await api.deleteTourGalleryImage(Number(id));
  };

  const handleSaveTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      setToast({ message: 'Tour title is required', type: 'error' });
      return;
    }

    try {
      setSaving(true);
      const payload: Partial<PanoramicTourItem> = {
        title: formTitle.trim(),
        slug: formSlug.trim() || formTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        description: formDescription.trim(),
        cover_image: formCoverImage.trim() || null,
        is_featured: formIsFeatured,
      };

      if (editingTour) {
        const updated = await api.updatePanoramicTour(editingTour.id, payload);
        updated.gallery_images = formGalleryImages;
        setTours(prev => prev.map(t => (t.id === updated.id ? { ...t, ...updated } : t)));
        setToast({ message: `Tour "${updated.title}" updated successfully`, type: 'success' });
      } else {
        const created = await api.createPanoramicTour(payload);
        if (formGalleryImages.length > 0) {
          const savedGallery: GalleryImageItem[] = [];
          for (const g of formGalleryImages) {
            try {
              const res = await api.addTourGalleryImage(created.id, {
                image: g.image,
                caption: g.caption,
                subtitle: g.subtitle,
                order: g.order || 0,
              });
              savedGallery.push(res);
            } catch {
              savedGallery.push(g);
            }
          }
          created.gallery_images = savedGallery;
        }
        setTours(prev => [created, ...prev]);
        setToast({ message: `Tour "${created.title}" created successfully`, type: 'success' });
      }

      setIsModalOpen(false);
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to save tour', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddScene = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTourForScenes) return;
    if (!newSceneName.trim()) {
      setToast({ message: 'Scene name is required', type: 'error' });
      return;
    }

    try {
      setAddingScene(true);
      const scenePayload: Partial<PanoramicSceneItem> = {
        name: newSceneName.trim(),
        panorama: newScenePanorama.trim() || '/1.jpg',
        initial_yaw: Number(newSceneYaw) || 0,
        initial_pitch: Number(newScenePitch) || 0,
        hotSpots: [],
      };

      const createdScene = await api.createPanoramicScene(selectedTourForScenes.id, scenePayload);
      
      // Update local state
      const updatedTour = {
        ...selectedTourForScenes,
        panoramicScenes: [...(selectedTourForScenes.panoramicScenes || []), createdScene],
      };
      setSelectedTourForScenes(updatedTour);
      setTours(prev => prev.map(t => (t.id === updatedTour.id ? updatedTour : t)));

      setNewSceneName('');
      setToast({ message: `Scene "${createdScene.name}" added to tour`, type: 'success' });
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to add scene', type: 'error' });
    } finally {
      setAddingScene(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      if (deleteTarget.type === 'tour') {
        await api.deletePanoramicTour(deleteTarget.id);
        setTours(prev => prev.filter(t => t.id !== deleteTarget.id));
        setToast({ message: `Tour "${deleteTarget.title}" deleted`, type: 'success' });
        if (selectedTourForScenes?.id === deleteTarget.id) {
          setSelectedTourForScenes(null);
        }
      } else if (deleteTarget.type === 'scene') {
        await api.deletePanoramicScene(deleteTarget.id);
        if (selectedTourForScenes) {
          const updatedScenes = selectedTourForScenes.panoramicScenes.filter(
            s => String(s.id) !== String(deleteTarget.id)
          );
          const updatedTour = { ...selectedTourForScenes, panoramicScenes: updatedScenes };
          setSelectedTourForScenes(updatedTour);
          setTours(prev => prev.map(t => (t.id === updatedTour.id ? updatedTour : t)));
        }
        setToast({ message: `Scene "${deleteTarget.title}" deleted`, type: 'success' });
      }
    } catch (err: any) {
      setToast({ message: err.message || 'Failed to delete item', type: 'error' });
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filteredTours = tours.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">360° Virtual Reality Tours</h1>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-[#172e31] text-cyan-300 border border-[#205b63]">
              {tours.length} TOURS LIVE
            </span>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            SPATIAL TELEMETRY // EQUIRECTANGULAR IMMERSION ENGINES // HOTSPOT COMPASS
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/gallery"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase tracking-wider border border-slate-700/80 transition-all"
          >
            <span>Public Gallery</span>
            <ExternalLink size={13} className="text-slate-400" />
          </a>

          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#172e31] to-[#205b63] hover:from-[#1b373b] hover:to-[#266e77] text-white text-xs font-bold uppercase tracking-wider border border-[#2d7882] shadow-lg shadow-teal-950/40 cursor-pointer transition-all"
          >
            <Plus size={15} />
            <span>Create 360 Tour</span>
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search spatial tours..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0e1719] border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:border-[#205b63] focus:outline-none"
          />
        </div>
      </div>

      {/* Tours Grid */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-500 gap-3">
          <Loader2 size={32} className="animate-spin text-cyan-400" />
          <p className="text-xs font-mono uppercase tracking-widest">Compiling Spatial Panoramas...</p>
        </div>
      ) : filteredTours.length === 0 ? (
        <div className="py-20 rounded-3xl border border-dashed border-slate-800 text-center bg-[#0e1719]/40">
          <Move3D size={40} className="mx-auto text-slate-600 mb-3" />
          <p className="text-sm font-bold text-slate-300">No Panoramic Tours Found</p>
          <p className="text-xs text-slate-500 font-mono mt-1">Initialize your first 360° equirectangular virtual tour</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => {
            const scenesCount = tour.panoramicScenes?.length || 0;
            return (
              <div
                key={tour.id}
                className="group relative rounded-3xl bg-[#0c1315] border border-slate-800/80 hover:border-[#172e31] transition-all overflow-hidden flex flex-col shadow-xl"
              >
                {/* Image Cover */}
                <div className="aspect-[16/9] w-full overflow-hidden bg-slate-900 relative">
                  <img
                    src={resolveImageUrl(tour.cover_image, '/1.jpg')}
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c1315] via-transparent to-black/40" />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-black/75 text-cyan-300 border border-cyan-800/50 backdrop-blur-md flex items-center gap-1.5">
                      <Compass size={11} />
                      <span>{scenesCount} {scenesCount === 1 ? 'SCENE' : 'SCENES'}</span>
                    </span>
                    {tour.is_featured && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#d4af37]/20 text-[#d4af37] border border-[#d4af37]/40 backdrop-blur-md">
                        FEATURED
                      </span>
                    )}
                  </div>

                  {/* Actions Bar on Image */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    <a
                      href={`/view360/${tour.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Launch 360 Viewer"
                      className="p-2 rounded-xl bg-black/70 hover:bg-[#172e31] text-cyan-300 border border-slate-700 backdrop-blur-md transition-colors"
                    >
                      <Eye size={14} />
                    </a>
                    <button
                      onClick={() => handleOpenEditModal(tour)}
                      title="Edit Tour"
                      className="p-2 rounded-xl bg-black/70 hover:bg-[#172e31] text-slate-300 hover:text-white border border-slate-700 backdrop-blur-md transition-colors cursor-pointer"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ type: 'tour', id: tour.id, title: tour.title })}
                      title="Delete Tour"
                      className="p-2 rounded-xl bg-black/70 hover:bg-rose-900/50 text-slate-300 hover:text-rose-400 border border-slate-700 backdrop-blur-md transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Tour Info */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight line-clamp-1">{tour.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                      {tour.description || 'No spatial narrative provided.'}
                    </p>
                  </div>

                  {/* Scenes Quick Bar */}
                  <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500 uppercase">
                      ID: VR-{String(tour.id).padStart(3, '0')}
                    </span>
                    <button
                      onClick={() => setSelectedTourForScenes(tour)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#172e31]/60 hover:bg-[#172e31] text-cyan-300 text-xs font-bold uppercase tracking-wider border border-[#205b63]/60 transition-all cursor-pointer"
                    >
                      <Layers size={13} />
                      <span>Manage Scenes</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* -------------------- TOUR CREATE / EDIT MODAL WITH LIVE 360 PREVIEW -------------------- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className={`fixed inset-0 z-50 flex items-center justify-center ${isFullscreen ? 'p-0' : 'p-2 sm:p-4'} overflow-y-auto`}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              className={`relative ${
                isFullscreen
                  ? 'w-screen h-screen rounded-none border-0'
                  : 'w-[98vw] max-w-[1720px] h-[94vh] rounded-3xl border border-[#172e31]'
              } bg-[#0b1214] shadow-2xl z-10 my-auto flex flex-col text-white transition-all duration-300 overflow-hidden`}
            >
              {/* Header & Mode Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-slate-800 bg-[#0f181b] shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#172e31] flex items-center justify-center text-cyan-300 shrink-0">
                    <Move3D size={18} className="animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <span>{editingTour ? 'Edit 360 Virtual Tour' : 'Create 360 Virtual Tour'}</span>
                      <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-950 text-cyan-300 border border-cyan-800/60">
                        Live 360 Preview
                      </span>
                    </h3>
                    <p className="text-[11px] font-mono text-slate-400">Configure spatial architecture metadata and review public gallery presentation</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <div className="flex items-center p-1 bg-[#142023] rounded-xl border border-slate-800 text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => setPreviewLayout('form')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        previewLayout === 'form' ? 'bg-[#205b63] text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Form
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewLayout('split')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        previewLayout === 'split' ? 'bg-[#205b63] text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Split 50/50
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewLayout('preview')}
                      className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                        previewLayout === 'preview' ? 'bg-[#205b63] text-white font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Preview
                    </button>
                  </div>

                  {/* Fullscreen Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="p-2 rounded-xl bg-[#142023] border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title={isFullscreen ? 'Exit Full Screen' : 'Full Screen Mode'}
                  >
                    {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Split Canvas */}
              <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
                
                {/* LEFT PANE: Form */}
                {(previewLayout === 'split' || previewLayout === 'form') && (
                  <div className={`${previewLayout === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'} p-6 space-y-4 overflow-y-auto max-h-[80vh]`}>
                    <form id="tour-form" onSubmit={handleSaveTour} className="space-y-4">
                      <div>
                        <label className="block text-xs font-mono text-slate-400 uppercase mb-1">
                          Tour Title <span className="text-rose-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formTitle}
                          onChange={(e) => setFormTitle(e.target.value)}
                          placeholder="e.g. Modern Minimalist Penthouse 360"
                          className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white focus:border-[#205b63] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Slug (URL Identifier)</label>
                        <input
                          type="text"
                          value={formSlug}
                          onChange={(e) => setFormSlug(e.target.value)}
                          placeholder="e.g. modern-minimalist-penthouse-360"
                          className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white font-mono focus:border-[#205b63] focus:outline-none"
                        />
                      </div>

                      {/* Main Cover & Companion Gallery Images */}
                      <MediaGalleryManager
                        mainImage={formCoverImage}
                        onMainImageChange={(url) => setFormCoverImage(url || '')}
                        galleryImages={formGalleryImages}
                        onGalleryImagesChange={setFormGalleryImages}
                        contentTypeLabel="360 Tour"
                        onAddServerImage={editingTour ? handleAddServerGalleryImage : undefined}
                        onDeleteServerImage={editingTour ? handleDeleteServerGalleryImage : undefined}
                      />

                      <div>
                        <label className="block text-xs font-mono text-slate-400 uppercase mb-1">Description / Spatial Narrative</label>
                        <textarea
                          rows={3}
                          value={formDescription}
                          onChange={(e) => setFormDescription(e.target.value)}
                          placeholder="Immersive spatial visualization capturing the light well and mezzanine..."
                          className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white focus:border-[#205b63] focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="checkbox"
                          id="tourFeatured"
                          checked={formIsFeatured}
                          onChange={(e) => setFormIsFeatured(e.target.checked)}
                          className="w-4 h-4 rounded bg-[#080d0e] border-slate-700 accent-[#205b63]"
                        />
                        <label htmlFor="tourFeatured" className="text-xs font-mono text-slate-300 cursor-pointer">
                          Feature on Studio Homepage & VR Hero Showcase
                        </label>
                      </div>
                    </form>
                  </div>
                )}

                {/* RIGHT PANE: Authentic Live Website 360° Preview */}
                {(previewLayout === 'split' || previewLayout === 'preview') && (
                  <div className={`${previewLayout === 'split' ? 'lg:col-span-6' : 'lg:col-span-12'} bg-[#070b0c] p-5 flex flex-col justify-between overflow-y-auto max-h-[80vh]`}>
                    <div>
                      {/* Browser Chrome & Controls */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                          <span className="ml-2 text-[10px] font-mono text-slate-500 bg-[#142023] px-2.5 py-0.5 rounded-md border border-slate-800">
                            roha.studio/gallery/preview
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center p-0.5 bg-[#142023] rounded-lg border border-slate-800 text-[10px] font-mono">
                            <button
                              type="button"
                              onClick={() => setPreviewTab('card')}
                              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                                previewTab === 'card' ? 'bg-[#205b63] text-white font-bold' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              Gallery Card
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewTab('panorama')}
                              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                                previewTab === 'panorama' ? 'bg-[#205b63] text-white font-bold' : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              360 Viewport
                            </button>
                          </div>

                          <div className="flex items-center p-0.5 bg-[#142023] rounded-lg border border-slate-800 text-[10px] font-mono">
                            <button
                              type="button"
                              onClick={() => setPreviewDevice('desktop')}
                              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                                previewDevice === 'desktop' ? 'bg-slate-700 text-white' : 'text-slate-400'
                              }`}
                            >
                              Desktop
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewDevice('mobile')}
                              className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                                previewDevice === 'mobile' ? 'bg-slate-700 text-white' : 'text-slate-400'
                              }`}
                            >
                              Mobile
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* PREVIEW CONTENT */}
                      <div className={`mx-auto transition-all duration-300 ${
                        previewDevice === 'mobile' ? 'max-w-[320px]' : 'max-w-[420px]'
                      }`}>
                        {previewTab === 'card' ? (
                          /* Authentic 360 Gallery Card as on /gallery */
                          <div className="bg-black p-3 rounded-2xl border border-slate-800 shadow-2xl">
                            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                              <span>● Live /gallery Showcase</span>
                              <span>Interactive 360</span>
                            </div>

                            <div className="group relative overflow-hidden rounded-2xl bg-gray-950 aspect-[4/5] border border-gray-800 shadow-2xl cursor-pointer">
                              <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                style={{
                                  backgroundImage: `url(${resolveImageUrl(formCoverImage, '/1.jpg')})`
                                }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />

                              {/* 360 Tour Badge */}
                              <div className="absolute top-4 left-4 bg-[#395e63] px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-lg">
                                <Move3D size={12} className="animate-pulse" />
                                <span>360° TOUR</span>
                              </div>

                              <div className="absolute bottom-5 left-5 right-5">
                                <span className="text-cyan-400 text-[10px] uppercase font-bold tracking-widest font-mono block">
                                  {editingTour?.panoramicScenes?.length || 1} INTERACTIVE SCENES
                                </span>
                                <h3 className="text-xl sm:text-2xl font-bold mt-1 mb-1 text-white leading-tight">
                                  {formTitle || 'Untitled 360° Experience'}
                                </h3>
                                <div className="flex items-center gap-1.5 text-gray-300 text-xs">
                                  <MapPin size={13} className="text-[#395e63]" />
                                  <span>Addis Ababa, Ethiopia</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Equirectangular Panorama Viewport Simulation */
                          <div className="rounded-2xl overflow-hidden border border-slate-800 bg-[#0c1315] p-4 shadow-2xl space-y-3">
                            <div className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest flex items-center justify-between border-b border-white/10 pb-2">
                              <span>● Equirectangular Camera Viewport</span>
                              <span>Field of View: 100°</span>
                            </div>

                            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-white/15 group">
                              <img
                                src={resolveImageUrl(formCoverImage, '/1.jpg')}
                                alt="360 Scene"
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/25 pointer-events-none" />

                              {/* HUD Reticle */}
                              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-12 h-12 rounded-full border border-cyan-400/60 flex items-center justify-center">
                                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-ping" />
                                </div>
                              </div>

                              {/* Top Bar HUD */}
                              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[10px] font-mono bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10">
                                <span className="text-cyan-300 flex items-center gap-1">
                                  <Compass size={12} /> YAW: 180° [S]
                                </span>
                                <span className="text-slate-300">PITCH: 0.0°</span>
                                <span className="text-emerald-400">FPS: 60</span>
                              </div>

                              <div className="absolute bottom-2.5 left-2.5 right-2.5 flex justify-center">
                                <span className="px-3 py-1 rounded-full bg-[#205b63]/90 backdrop-blur-md text-[10px] font-mono text-white font-bold uppercase tracking-wider">
                                  360° Spherical Immersion Active
                                </span>
                              </div>
                            </div>

                            <p className="text-[11px] text-slate-400 font-mono text-center">
                              High-resolution equirectangular spherical texture projection with spatial audio tags.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>Real-time WebGL rendering preview</span>
                      <span className="text-cyan-400">ROHA Virtual Reality Engine</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-[#0f181b] rounded-b-3xl shrink-0">
                <span className="text-xs text-slate-500 font-mono hidden sm:inline-block">
                  Changes will be reflected across 360 gallery and VR viewer
                </span>
                <div className="flex items-center gap-3 ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="tour-form"
                    disabled={saving}
                    className="px-6 py-2.5 rounded-xl bg-[#205b63] hover:bg-[#286f78] text-white text-xs font-bold uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
                  >
                    {saving ? <Loader2 size={14} className="animate-spin" /> : null}
                    <span>{editingTour ? 'Update Tour' : 'Create Tour'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------- SCENES MANAGEMENT DRAWER -------------------- */}
      <AnimatePresence>
        {selectedTourForScenes && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTourForScenes(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-2xl bg-[#0c1315] border-l border-[#172e31] h-full shadow-2xl p-6 sm:p-8 flex flex-col z-10 text-white overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#172e31] text-cyan-300">
                      SPATIAL SCENE ENGINE
                    </span>
                    <span className="text-xs text-slate-400 font-mono">VR-{selectedTourForScenes.id}</span>
                  </div>
                  <h2 className="text-lg font-black text-white mt-1 uppercase tracking-tight">
                    {selectedTourForScenes.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedTourForScenes(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Existing Scenes List */}
              <div className="mt-6">
                <h3 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-3">
                  Configured Panoramic Scenes ({selectedTourForScenes.panoramicScenes?.length || 0})
                </h3>

                <div className="space-y-3">
                  {(!selectedTourForScenes.panoramicScenes || selectedTourForScenes.panoramicScenes.length === 0) ? (
                    <div className="p-6 rounded-2xl border border-dashed border-slate-800 text-center text-xs text-slate-500 font-mono">
                      No scenes defined for this tour yet. Add one below.
                    </div>
                  ) : (
                    selectedTourForScenes.panoramicScenes.map((scene, idx) => (
                      <div
                        key={scene.id || idx}
                        className="p-4 rounded-2xl bg-[#080d0e] border border-slate-800/90 flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-14 h-10 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800">
                            <img
                              src={resolveImageUrl(scene.panorama, '/1.jpg')}
                              alt={scene.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{scene.name}</p>
                            <p className="text-[10px] font-mono text-slate-500 truncate mt-0.5">
                              {scene.panorama} // YAW: {scene.initial_yaw}° // PITCH: {scene.initial_pitch}°
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setDeleteTarget({
                            type: 'scene',
                            id: Number(scene.id),
                            title: scene.name,
                          })}
                          className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Add New Scene Form */}
              <div className="mt-8 pt-6 border-t border-slate-800">
                <h3 className="text-xs font-mono text-cyan-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Plus size={14} />
                  <span>Add Equirectangular Scene</span>
                </h3>

                <form onSubmit={handleAddScene} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Scene Name</label>
                    <input
                      type="text"
                      required
                      value={newSceneName}
                      onChange={(e) => setNewSceneName(e.target.value)}
                      placeholder="e.g. Master Living Salon"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white focus:border-[#205b63] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">
                      Equirectangular Panorama Image
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={newScenePanorama}
                        onChange={(e) => setNewScenePanorama(e.target.value)}
                        placeholder="/1.jpg or /3.jpg"
                        className="flex-1 px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white font-mono focus:border-[#205b63] focus:outline-none"
                      />
                      <input
                        ref={sceneFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleSceneUpload}
                      />
                      <button
                        type="button"
                        disabled={uploadingSceneImg}
                        onClick={() => sceneFileInputRef.current?.click()}
                        className="px-3.5 py-2 rounded-xl bg-[#205b63] hover:bg-[#286f78] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shrink-0 disabled:opacity-50 transition-colors"
                        title="Upload 360 panorama directly from device"
                      >
                        {uploadingSceneImg ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                        <span>{uploadingSceneImg ? 'Uploading...' : 'Upload'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setImagePickerTarget('scene_panorama')}
                        className="px-3 py-2 rounded-xl bg-[#172e31] hover:bg-[#205b63] text-cyan-300 text-xs font-bold uppercase tracking-wider border border-[#205b63] flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <ImageIcon size={13} />
                        <span>Select</span>
                      </button>
                    </div>
                    {newScenePanorama && (
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-slate-800 mt-2">
                        <img
                          src={resolveImageUrl(newScenePanorama, '/1.jpg')}
                          alt="Scene Panorama Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[9px] font-mono text-cyan-300 border border-cyan-800/40">
                          ● Live Equirectangular Projection
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Initial Yaw (°)</label>
                      <input
                        type="number"
                        value={newSceneYaw}
                        onChange={(e) => setNewSceneYaw(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white font-mono focus:border-[#205b63] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 uppercase mb-1">Initial Pitch (°)</label>
                      <input
                        type="number"
                        value={newScenePitch}
                        onChange={(e) => setNewScenePitch(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#080d0e] border border-slate-800 text-xs text-white font-mono focus:border-[#205b63] focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={addingScene}
                    className="w-full mt-2 px-5 py-2.5 rounded-xl bg-[#172e31] hover:bg-[#205b63] text-white text-xs font-bold uppercase tracking-wider border border-[#2d7882] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    {addingScene && <Loader2 size={14} className="animate-spin" />}
                    <span>Add Scene to Tour</span>
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* -------------------- IMAGE ASSET PICKER MODAL -------------------- */}
      <ImagePickerModal
        isOpen={imagePickerTarget !== null}
        onClose={() => setImagePickerTarget(null)}
        currentValue={imagePickerTarget === 'tour_cover' ? formCoverImage : newScenePanorama}
        onSelect={(path) => {
          if (imagePickerTarget === 'tour_cover') setFormCoverImage(path);
          if (imagePickerTarget === 'scene_panorama') setNewScenePanorama(path);
        }}
        title={imagePickerTarget === 'scene_panorama' ? 'Select Equirectangular Panorama' : 'Select Tour Cover Image'}
      />

      {/* -------------------- CONFIRM DELETE MODAL -------------------- */}
      <ConfirmModal
        isOpen={deleteTarget !== null}
        title={`Delete ${deleteTarget?.type === 'tour' ? 'Panoramic Tour' : 'Scene'}?`}
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This spatial data will be permanently removed.`}
        confirmLabel="Confirm Delete"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
