import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  X,
  Loader2,
  Compass,
  Layers,
  Eye,
  Check,
  Image as ImageIcon
} from 'lucide-react';
import {
  api,
  resolveImageUrl,
  type PanoramicTourItem,
} from '../../services/api';
import { ConfirmModal } from '../components/ConfirmModal';
import { ToastContainer, type ToastMessage } from '../components/Toast';
import { ImagePickerModal } from '../components/ImagePickerModal';
import { MediaGalleryManager } from '../components/MediaGalleryManager';

export const AdminTours: React.FC = () => {
  const [tours, setTours] = useState<PanoramicTourItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Tour Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'media' | 'scenes'>('details');
  const [editingTour, setEditingTour] = useState<Partial<PanoramicTourItem> | null>(null);
  const [saving, setSaving] = useState(false);

  // Scene Management Drawer State
  const [selectedTourForScenes, setSelectedTourForScenes] = useState<PanoramicTourItem | null>(null);
  const [newSceneName, setNewSceneName] = useState('');
  const [newScenePanorama, setNewScenePanorama] = useState('/1.jpg');
  const [newSceneYaw, setNewSceneYaw] = useState<number>(180);
  const [newScenePitch, setNewScenePitch] = useState<number>(0);
  const [addingScene, setAddingScene] = useState(false);
  const [isScenePickerOpen, setIsScenePickerOpen] = useState(false);

  // Confirm Delete
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'tour' | 'scene'; id: number; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (type: 'success' | 'error', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const loadTours = async () => {
    try {
      setLoading(true);
      const data = await api.getPanoramicTours();
      setTours(data);
    } catch (err: any) {
      addToast('error', 'Failed to fetch virtual tours', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTours();
  }, []);

  const handleOpenCreateModal = () => {
    setActiveTab('details');
    setEditingTour({
      title: '',
      slug: '',
      description: '',
      cover_image: '/1.jpg',
      is_featured: true,
      panoramicScenes: [],
      gallery_images: [],
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = async (tour: PanoramicTourItem) => {
    setActiveTab('details');
    try {
      const fullDetail = await api.getPanoramicTour(tour.id);
      setEditingTour(fullDetail);
      setIsModalOpen(true);
    } catch (err: any) {
      setEditingTour({ ...tour });
      setIsModalOpen(true);
    }
  };

  const handleSaveTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTour?.title?.trim()) {
      addToast('error', 'Validation Error', 'Tour title is required.');
      return;
    }

    try {
      setSaving(true);
      if (editingTour.id) {
        await api.updatePanoramicTour(editingTour.id, editingTour);
        addToast('success', 'Virtual Tour Updated', `"${editingTour.title}" saved.`);
      } else {
        await api.createPanoramicTour(editingTour);
        addToast('success', 'Virtual Tour Created', `"${editingTour.title}" added to VR portfolio.`);
      }
      setIsModalOpen(false);
      setEditingTour(null);
      await loadTours();
    } catch (err: any) {
      addToast('error', 'Failed to Save Tour', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddScene = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTourForScenes || !newSceneName.trim()) return;

    try {
      setAddingScene(true);
      await api.addTourScene(selectedTourForScenes.id, {
        name: newSceneName.trim(),
        panorama: newScenePanorama,
        initial_yaw: newSceneYaw,
        initial_pitch: newScenePitch,
      });

      addToast('success', 'Scene Added', `"${newSceneName}" added to tour.`);
      setNewSceneName('');
      setNewScenePanorama('/1.jpg');

      const updated = await api.getPanoramicTour(selectedTourForScenes.id);
      setSelectedTourForScenes(updated);
      setTours(prev => prev.map(t => t.id === updated.id ? updated : t));
    } catch (err: any) {
      addToast('error', 'Failed to Add Scene', err.message);
    } finally {
      setAddingScene(false);
    }
  };

  const handleDeleteScene = async (sceneId: number | string, sceneName: string) => {
    if (!selectedTourForScenes) return;
    try {
      await api.deleteTourScene(sceneId);
      addToast('success', 'Scene Deleted', `"${sceneName}" removed.`);
      const updated = await api.getPanoramicTour(selectedTourForScenes.id);
      setSelectedTourForScenes(updated);
      setTours(prev => prev.map(t => t.id === updated.id ? updated : t));
    } catch (err: any) {
      addToast('error', 'Failed to Delete Scene', err.message);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    try {
      setIsDeleting(true);
      if (deleteTarget.type === 'tour') {
        await api.deletePanoramicTour(deleteTarget.id);
        addToast('success', 'Tour Deleted', `"${deleteTarget.title}" was removed.`);
        setTours(prev => prev.filter(t => t.id !== deleteTarget.id));
      }
      setDeleteTarget(null);
    } catch (err: any) {
      addToast('error', 'Delete Failed', err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredTours = useMemo(() => {
    return tours.filter(t =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [tours, search]);

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      <ToastContainer toasts={toasts} onClose={(id) => setToasts(t => t.filter(x => x.id !== id))} />

      {/* -------------------- EDITORIAL HEADER -------------------- */}
      <section className="flex flex-col justify-between gap-5 md:flex-row md:items-end border-b border-white/10 pb-7">
        <div>
          <p className="eyebrow mb-2 text-cyan-400">
            Immersive archive / {tours.length < 10 ? `0${tours.length}` : tours.length} tours
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.035em] text-white">
            Virtual Experiences
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-xl">
            Build guided 360° interactive virtual journeys through your built architectural spaces and pavilions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/gallery"
            target="_blank"
            rel="noopener noreferrer"
            className="secondary-button"
          >
            <Eye size={15} />
            <span>Public VR Gallery</span>
          </a>

          <button
            onClick={handleOpenCreateModal}
            className="primary-button shadow-sm"
          >
            <Plus size={15} />
            <span>New virtual tour</span>
          </button>
        </div>
      </section>

      {/* -------------------- SEARCH TOOLBAR -------------------- */}
      <section className="panel p-4 sm:p-5">
        <div className="relative max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search virtual tours..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </section>

      {/* -------------------- TOURS GRID -------------------- */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400 text-xs gap-3">
          <Loader2 size={24} className="animate-spin text-cyan-400" />
          <span className="font-mono uppercase tracking-wider">Loading virtual tours...</span>
        </div>
      ) : filteredTours.length === 0 ? (
        <div className="panel p-16 text-center text-sm text-slate-400">
          No virtual tours found. Click &quot;New virtual tour&quot; to create your first 360° spatial journey.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => {
            const sceneCount = tour.panoramicScenes?.length || 0;
            return (
              <article
                key={tour.id}
                className="panel overflow-hidden group hover:shadow-xl hover:border-cyan-400/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div
                    className="aspect-[16/10] w-full bg-black/50 bg-cover bg-center relative overflow-hidden"
                    style={{
                      backgroundImage: `url(${resolveImageUrl(tour.cover_image || '/1.jpg')})`,
                    }}
                  >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />

                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-cyan-950/90 text-cyan-300 font-semibold border border-cyan-500/30 shadow-xs flex items-center gap-1">
                        <Compass size={11} className="text-cyan-400" />
                        <span>{sceneCount} {sceneCount === 1 ? 'Scene' : 'Scenes'}</span>
                      </span>
                      {tour.is_featured && (
                        <span className="status-pill featured shadow-xs">
                          Featured
                        </span>
                      )}
                    </div>

                    <a
                      href={`/view360?tour=${tour.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="icon-button absolute top-3 right-3 bg-black/60 text-white hover:bg-cyan-600 shadow-xs border-white/20"
                      title="Launch 360 Viewer"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>

                  <div className="p-5">
                    <h3 className="font-display text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                      {tour.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                      {tour.description || 'Interactive 360° architectural space panorama.'}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-black/30 border-t border-white/10 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setSelectedTourForScenes(tour)}
                    className="text-xs font-semibold text-cyan-300 hover:text-cyan-200 flex items-center gap-1 cursor-pointer"
                  >
                    <Layers size={13} />
                    <span>Scenes ({sceneCount})</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(tour)}
                      className="secondary-button text-xs py-1.5 px-3"
                    >
                      <Edit3 size={13} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteTarget({ type: 'tour', id: tour.id, title: tour.title })}
                      className="icon-button text-rose-400 hover:bg-rose-950/60 border-rose-800/40"
                      title="Delete tour"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* -------------------- CREATE / EDIT TOUR MODAL -------------------- */}
      {isModalOpen && editingTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => !saving && setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#132527] border border-white/15 rounded-2xl shadow-2xl flex flex-col z-10 text-white overflow-hidden backdrop-blur-xl">
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0f1c1d]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-xs">
                  <Compass size={18} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold text-white">
                    {editingTour.id ? `Edit: ${editingTour.title}` : 'Create Virtual 360 Tour'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Configure tour metadata and panoramic visuals
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                disabled={saving}
                className="icon-button"
              >
                <X size={17} />
              </button>
            </div>

            <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/10 bg-black/30">
              {[
                { id: 'details', label: '1. Tour Details' },
                { id: 'media', label: '2. Cover & Assets' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 px-3 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 cursor-pointer ${
                    activeTab === tab.id
                      ? 'border-cyan-400 text-cyan-300'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveTour} className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeTab === 'details' && (
                <div className="space-y-4 animate-in fade-in">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Tour Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingTour.title || ''}
                      onChange={(e) => setEditingTour({ ...editingTour, title: e.target.value })}
                      placeholder="e.g. Lighthouse House Spatial Walkthrough"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Description
                    </label>
                    <textarea
                      rows={4}
                      value={editingTour.description || ''}
                      onChange={(e) => setEditingTour({ ...editingTour, description: e.target.value })}
                      placeholder="Describe the immersive guided experience..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-xl bg-black/40 border border-white/10">
                    <input
                      type="checkbox"
                      id="is_tour_featured"
                      checked={editingTour.is_featured || false}
                      onChange={(e) => setEditingTour({ ...editingTour, is_featured: e.target.checked })}
                      className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                    />
                    <label htmlFor="is_tour_featured" className="text-xs font-semibold text-slate-200 cursor-pointer">
                      Feature on Virtual Reality Experience Showcase
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'media' && (
                <div className="animate-in fade-in">
                  <MediaGalleryManager
                    mainImage={editingTour.cover_image || null}
                    onMainImageChange={(url) => setEditingTour({ ...editingTour, cover_image: url || '' })}
                    galleryImages={editingTour.gallery_images || []}
                    onGalleryImagesChange={(images) => setEditingTour({ ...editingTour, gallery_images: images })}
                    contentTypeLabel="Virtual Tour"
                  />
                </div>
              )}

              <div className="pt-5 border-t border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                  className="secondary-button text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="primary-button text-xs shadow-md"
                >
                  {saving ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Saving tour...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>{editingTour.id ? 'Update Tour' : 'Publish Tour'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- SCENES MANAGEMENT DRAWER -------------------- */}
      {selectedTourForScenes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => setSelectedTourForScenes(null)}
          />

          <div className="relative w-full max-w-2xl bg-[#132527] border border-white/15 rounded-2xl p-6 shadow-2xl z-10 text-white max-h-[90vh] flex flex-col backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="font-display text-xl font-semibold text-white">
                  Tour Scenes: {selectedTourForScenes.title}
                </h3>
                <p className="text-xs text-slate-400">
                  Manage 360° panoramas and initial camera orientation for each viewpoint
                </p>
              </div>
              <button
                onClick={() => setSelectedTourForScenes(null)}
                className="icon-button"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-5 space-y-6">
              {/* Add Scene Form */}
              <form onSubmit={handleAddScene} className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Add 360° Scene Viewpoint
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Scene Name
                    </label>
                    <input
                      type="text"
                      required
                      value={newSceneName}
                      onChange={(e) => setNewSceneName(e.target.value)}
                      placeholder="e.g. Master Living Pavilion / Courtyard Walk"
                      className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                      Equirectangular 360° Panorama Path
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={newScenePanorama}
                        onChange={(e) => setNewScenePanorama(e.target.value)}
                        placeholder="/1.jpg or /uploads/..."
                        className="flex-1 px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                      <button
                        type="button"
                        onClick={() => setIsScenePickerOpen(true)}
                        className="secondary-button text-xs"
                      >
                        <ImageIcon size={13} />
                        <span>Select Photo</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                        Initial Yaw Angle ({newSceneYaw}°)
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={newSceneYaw}
                        onChange={(e) => setNewSceneYaw(Number(e.target.value))}
                        className="w-full accent-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 uppercase mb-1">
                        Initial Pitch Angle ({newScenePitch}°)
                      </label>
                      <input
                        type="range"
                        min="-90"
                        max="90"
                        value={newScenePitch}
                        onChange={(e) => setNewScenePitch(Number(e.target.value))}
                        className="w-full accent-cyan-400"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={addingScene}
                  className="primary-button text-xs w-full justify-center mt-2"
                >
                  {addingScene ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                  <span>Add Scene to Tour</span>
                </button>
              </form>

              {/* Scenes List */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Current Scenes ({selectedTourForScenes.panoramicScenes?.length || 0})
                </p>

                {(!selectedTourForScenes.panoramicScenes || selectedTourForScenes.panoramicScenes.length === 0) ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No scenes configured for this tour yet.</p>
                ) : (
                  selectedTourForScenes.panoramicScenes.map((scene, idx) => (
                    <div
                      key={scene.id || idx}
                      className="p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-14 h-10 rounded-md bg-black/60 bg-cover bg-center shrink-0 border border-white/10"
                          style={{ backgroundImage: `url(${resolveImageUrl(scene.panorama)})` }}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{scene.name}</p>
                          <p className="text-[10px] font-mono text-slate-400 truncate">
                            Yaw: {scene.initial_yaw}° • Pitch: {scene.initial_pitch}° • {scene.panorama}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteScene(scene.id, scene.name)}
                        className="icon-button text-rose-400 hover:bg-rose-950/60 border-rose-800/40"
                        title="Delete scene"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-right">
              <button
                onClick={() => setSelectedTourForScenes(null)}
                className="secondary-button text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Asset Picker for Scene Panorama */}
      {isScenePickerOpen && (
        <ImagePickerModal
          isOpen={true}
          onClose={() => setIsScenePickerOpen(false)}
          onSelect={(url) => {
            setNewScenePanorama(url);
            setIsScenePickerOpen(false);
          }}
          currentValue={newScenePanorama}
          title="Select 360 Equirectangular Panorama"
        />
      )}

      {/* -------------------- CONFIRM DELETE MODAL -------------------- */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Virtual Tour"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? All scenes and VR configurations will be removed.`}
        confirmLabel="Delete Tour"
        cancelLabel="Cancel"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
