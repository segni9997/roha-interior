import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  X,
  Loader2,
  LayoutGrid,
  List as ListIcon,
  Tag,
  FolderKanban,
  Check,
  Sparkles
} from 'lucide-react';
import {
  api,
  resolveImageUrl,
  type ModelProjectItem,
  type CategoryItem,
  type ModelProjectDetailItem
} from '../../services/api';
import { ConfirmModal } from '../components/ConfirmModal';
import { ToastContainer, type ToastMessage } from '../components/Toast';
import { MediaGalleryManager } from '../components/MediaGalleryManager';
import { HeroSectionEditorModal } from '../components/HeroSectionEditorModal';

export const AdminModels: React.FC = () => {
  const [models, setModels] = useState<ModelProjectItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modal & Editing State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'media' | 'fabrication'>('details');
  const [editingModel, setEditingModel] = useState<Partial<ModelProjectDetailItem> | null>(null);
  const [saving, setSaving] = useState(false);

  // Category Manager Modal
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [creatingCat, setCreatingCat] = useState(false);
  const [deletingCatId, setDeletingCatId] = useState<number | null>(null);
  const [isAddingModalCat, setIsAddingModalCat] = useState(false);
  const [modalCatName, setModalCatName] = useState('');

  // Delete Model Modal
  const [deleteTarget, setDeleteTarget] = useState<ModelProjectItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast Feedback
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const addToast = (type: 'success' | 'error', title: string, message?: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [modelList, cats] = await Promise.all([
        api.getModelProjects(),
        api.getModelCategories().catch(() => []),
      ]);
      setModels(modelList);
      setCategories(cats);
    } catch (err: any) {
      addToast('error', 'Failed to load scale models', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      addToast('error', 'Category Name Required', 'Please enter a name for the category.');
      return;
    }
    try {
      setCreatingCat(true);
      const created = await api.createModelCategory(newCatName.trim(), newCatDesc.trim());
      addToast('success', 'Category Created', `"${created.name}" added successfully.`);
      const updatedCats = await api.getModelCategories();
      setCategories(updatedCats);
      setNewCatName('');
      setNewCatDesc('');
    } catch (err: any) {
      addToast('error', 'Category Creation Failed', err.message);
    } finally {
      setCreatingCat(false);
    }
  };

  const handleDeleteCategory = async (catId: number, catName: string) => {
    try {
      setDeletingCatId(catId);
      await api.deleteModelCategory(catId);
      addToast('success', 'Category Removed', `"${catName}" has been deleted.`);
      const updatedCats = await api.getModelCategories();
      setCategories(updatedCats);
      if (selectedCat === catName) setSelectedCat('All');
    } catch (err: any) {
      addToast('error', 'Failed to Delete Category', err.message);
    } finally {
      setDeletingCatId(null);
    }
  };

  const handleQuickAddCategory = async () => {
    const trimmed = modalCatName.trim();
    if (!trimmed) {
      setIsAddingModalCat(false);
      return;
    }
    const existing = categories.find(c => c.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) {
      if (editingModel) {
        const currentIds = editingModel.category_ids && editingModel.category_ids.length > 0
          ? editingModel.category_ids
          : (editingModel.category ? [Number(editingModel.category)] : []);
        if (!currentIds.includes(existing.id)) {
          const updated = [...currentIds, existing.id];
          setEditingModel({
            ...editingModel,
            category_ids: updated,
            category: updated[0]
          });
        }
      }
      setModalCatName('');
      setIsAddingModalCat(false);
      addToast('success', 'Category Selected', `"${existing.name}" is already available.`);
      return;
    }

    try {
      const created = await api.createModelCategory(trimmed);
      setCategories(prev => [...prev, created]);
      if (editingModel) {
        const currentIds = editingModel.category_ids && editingModel.category_ids.length > 0
          ? editingModel.category_ids
          : (editingModel.category ? [Number(editingModel.category)] : []);
        const updated = [...currentIds, created.id];
        setEditingModel({
          ...editingModel,
          category_ids: updated,
          category: updated[0]
        });
      }
      setModalCatName('');
      setIsAddingModalCat(false);
      addToast('success', 'Category Created', `"${created.name}" created and selected.`);
    } catch (err: any) {
      addToast('error', 'Category Creation Failed', err.message);
    }
  };

  const handleOpenCreate = () => {
    setActiveTab('details');
    const firstCatId = categories[0]?.id || 1;
    setEditingModel({
      title: '',
      subtitle: '',
      description: '',
      category: firstCatId,
      category_ids: [firstCatId],
      scale_ratio: '1:50',
      cover_image: '',
      gallery_images: [],
      materials_used: 'Cast Acrylic, German Basswood, Brass Rods',
      dimensions_cm: '120 × 80 × 65 cm',
      illumination: 'Micro 3000K LED Fiber-Optics',
      day: '14 Working Days',
      fabrication_methods: 'CNC 5-Axis Milling, Laser Sintering',
      year: '2026',
      precision_tolerance: '±0.05 mm',
      order: (models.length || 0) + 1,
      is_featured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = async (modelItem: ModelProjectItem) => {
    try {
      setSaving(true);
      const full = await api.getModelProject(modelItem.id);
      const rawCatIds = full.category_ids && full.category_ids.length > 0
        ? full.category_ids
        : (full.categories && full.categories.length > 0
            ? full.categories.map((c: any) => c.id)
            : [typeof full.category === 'object' ? (full.category as any).id : Number(full.category || 1)]);

      setEditingModel({
        ...full,
        category: rawCatIds[0] || (typeof full.category === 'object' ? (full.category as any).id : Number(full.category || 1)),
        category_ids: rawCatIds,
        gallery_images: full.gallery_images || [],
      });
      setActiveTab('details');
      setIsModalOpen(true);
    } catch (err: any) {
      addToast('error', 'Failed to fetch scale model details', err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModel) return;

    if (!editingModel.title?.trim()) {
      addToast('error', 'Validation Error', 'Model title is mandatory.');
      return;
    }

    try {
      setSaving(true);
      const chosenCatIds = editingModel.category_ids && editingModel.category_ids.length > 0
        ? editingModel.category_ids
        : (editingModel.category ? [typeof editingModel.category === 'object' ? (editingModel.category as any).id : Number(editingModel.category)] : [categories[0]?.id || 1]);

      const payload: Partial<ModelProjectDetailItem> = {
        ...editingModel,
        category: chosenCatIds[0],
        category_ids: chosenCatIds,
      };

      if (editingModel.id) {
        await api.updateModelProject(editingModel.id, payload);
        addToast('success', 'Model Updated', `"${editingModel.title}" updated in archive.`);
      } else {
        await api.createModelProject(payload);
        addToast('success', 'Model Created', `"${editingModel.title}" added to fabrication database.`);
      }

      setIsModalOpen(false);
      setEditingModel(null);
      await loadData();
    } catch (err: any) {
      addToast('error', 'Save Failed', err.message || 'An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await api.deleteModelProject(deleteTarget.id);
      addToast('success', 'Model Removed', `"${deleteTarget.title}" deleted.`);
      setModels(prev => prev.filter(m => m.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (err: any) {
      addToast('error', 'Delete Failed', err.message);
    } finally {
      setDeleting(false);
    }
  };

  const filteredModels = useMemo(() => {
    return models.filter((item) => {
      const matchesSearch =
        search === '' ||
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        (item.materials_used && item.materials_used.toLowerCase().includes(search.toLowerCase())) ||
        (item.scale_ratio && item.scale_ratio.toLowerCase().includes(search.toLowerCase()));

      const names = item.category_names && item.category_names.length > 0
        ? item.category_names
        : (item.category_name ? [item.category_name] : []);

      const matchesCat =
        selectedCat === 'All' ||
        names.some(n => n.toLowerCase() === selectedCat.toLowerCase());

      return matchesSearch && matchesCat;
    });
  }, [models, search, selectedCat]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <ToastContainer toasts={toasts} onClose={(id) => setToasts(t => t.filter(x => x.id !== id))} />

      {/* -------------------- HERO SECTION -------------------- */}
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-white/10 pb-6">
        <div>
          <p className="eyebrow text-cyan-400">Workshop & Fabrication</p>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-white mt-1">
            Precision Scale Architectural Models
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Curate scale presentation models, fabrication specifications, tolerances, illumination schemes, and high-res photography.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsHeroModalOpen(true)}
            className="secondary-button text-xs border-cyan-500/30 text-cyan-200 hover:text-white"
            title="Change Model Making Hero Section images, heading, subheading, body text, and CTA"
          >
            <Sparkles size={14} className="text-cyan-400" />
            <span>Hero Section</span>
          </button>

          <button
            onClick={() => setIsCatModalOpen(true)}
            className="secondary-button"
            title="Manage model categories"
          >
            <Tag size={15} />
            <span>Categories ({categories.length})</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="primary-button shadow-sm"
          >
            <Plus size={15} />
            <span>New scale model</span>
          </button>
        </div>
      </section>

      {/* -------------------- TOOLBAR & FILTERS -------------------- */}
      <section className="panel p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by model title, material, or scale ratio..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['All', ...categories.map(c => c.name)].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`filter-chip text-xs ${
                    selectedCat === cat ? 'filter-chip-active' : ''
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 p-1 rounded-lg bg-black/40 border border-white/10">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-cyan-900/70 text-cyan-200 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
                title="Grid view"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-cyan-900/70 text-cyan-200 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
                title="List table view"
              >
                <ListIcon size={15} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------- MODELS DISPLAY -------------------- */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400 text-xs gap-3">
          <Loader2 size={24} className="animate-spin text-cyan-400" />
          <span className="font-mono uppercase tracking-wider">Loading physical model archive...</span>
        </div>
      ) : filteredModels.length === 0 ? (
        <div className="panel p-16 text-center text-sm text-slate-400">
          No matching physical scale models found in the fabrication archive.
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModels.map((modelItem) => (
            <article
              key={modelItem.id}
              className="panel overflow-hidden group hover:shadow-xl hover:border-cyan-400/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div
                  className="aspect-[16/10] w-full bg-black/50 bg-cover bg-center relative overflow-hidden"
                  style={{
                    backgroundImage: `url(${resolveImageUrl(modelItem.cover_image)})`,
                  }}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase px-2.5 py-1 rounded-full bg-cyan-950/90 text-cyan-300 font-semibold border border-cyan-500/30 shadow-xs">
                      Scale {modelItem.scale_ratio || '1:50'}
                    </span>
                    {modelItem.is_featured && (
                      <span className="status-pill featured shadow-xs">
                        Featured
                      </span>
                    )}
                  </div>

                  <a
                    href={`/project-detail?id=${modelItem.id}&type=model`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="icon-button absolute top-3 right-3 bg-black/60 text-white hover:bg-cyan-600 shadow-xs border-white/20"
                    title="View public project detail"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>

                <div className="p-5">
                  <h3 className="font-display text-xl font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                    {modelItem.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-2 font-mono flex-wrap">
                    <span className="text-cyan-400">
                      {modelItem.category_names && modelItem.category_names.length > 0
                        ? modelItem.category_names.join(', ')
                        : (modelItem.category_name || 'Fabrication')}
                    </span>
                    <span>•</span>
                    <span>{modelItem.year}</span>
                    <span>•</span>
                    <span>{modelItem.precision_tolerance || '±0.05 mm'}</span>
                  </p>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-2.5 leading-relaxed">
                    {modelItem.materials_used || modelItem.description || 'Precision physical model.'}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-black/30 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-slate-400">
                  ID: #{modelItem.id}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(modelItem)}
                    className="secondary-button text-xs py-1.5 px-3"
                  >
                    <Edit3 size={13} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteTarget(modelItem)}
                    className="icon-button text-rose-400 hover:bg-rose-950/60 border-rose-800/40"
                    title="Delete scale model"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="panel overflow-hidden divide-y divide-white/10">
          {filteredModels.map((modelItem) => (
            <div
              key={modelItem.id}
              className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div
                  className="w-20 h-14 rounded-lg bg-black/50 bg-cover bg-center shrink-0 border border-white/10"
                  style={{
                    backgroundImage: `url(${resolveImageUrl(modelItem.cover_image)})`,
                  }}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-semibold text-white truncate">
                      {modelItem.title}
                    </h3>
                    <span className="status-pill published">
                      Scale {modelItem.scale_ratio}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">
                    {(modelItem.category_names && modelItem.category_names.length > 0
                      ? modelItem.category_names.join(', ')
                      : modelItem.category_name)} · {modelItem.materials_used}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                <button
                  onClick={() => handleOpenEdit(modelItem)}
                  className="secondary-button text-xs"
                >
                  <Edit3 size={13} />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => setDeleteTarget(modelItem)}
                  className="icon-button text-rose-400 hover:bg-rose-950/60 border-rose-800/40"
                  title="Delete model"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* -------------------- CREATE / EDIT MODEL MODAL -------------------- */}
      {isModalOpen && editingModel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => !saving && setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#132527] border border-white/15 rounded-2xl shadow-2xl flex flex-col z-10 text-white overflow-hidden backdrop-blur-xl" data-lenis-prevent="true">
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0f1c1d] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-xs">
                  <FolderKanban size={18} />
                </div>
                <div>
                  <h2 className="font-display text-xl font-semibold text-white">
                    {editingModel.id ? `Edit: ${editingModel.title}` : 'Add Precision Scale Model'}
                  </h2>
                  <p className="text-xs text-slate-400">
                    Configure tolerances, fabrication materials, scale ratios, and high-res photography
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

            <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/10 bg-black/30 shrink-0">
              {[
                { id: 'details', label: '1. Model Details' },
                { id: 'media', label: '2. Photography & Gallery' },
                { id: 'fabrication', label: '3. Technical Fabrication Specs' },
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

            <form onSubmit={handleSaveModel} className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 custom-scrollbar" data-lenis-prevent="true">
              {/* TAB 1: DETAILS */}
              {activeTab === 'details' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Model Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingModel.title || ''}
                        onChange={(e) => setEditingModel({ ...editingModel, title: e.target.value })}
                        placeholder="e.g. Museum of Light Sectional Massing"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
                          Categories (Multi-Select) *
                        </label>
                        <span className="text-[10px] font-mono text-cyan-400">
                          {editingModel.category_ids?.length || (editingModel.category ? 1 : 0)} selected
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-black/40 border border-white/10 flex flex-wrap gap-2 min-h-[46px] items-center">
                        {categories.map((cat) => {
                          const currentIds = editingModel.category_ids && editingModel.category_ids.length > 0
                            ? editingModel.category_ids
                            : (editingModel.category ? [Number(editingModel.category)] : []);
                          const isSelected = currentIds.includes(cat.id);
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                let updated: number[];
                                if (isSelected) {
                                  if (currentIds.length <= 1) return;
                                  updated = currentIds.filter(id => id !== cat.id);
                                } else {
                                  updated = [...currentIds, cat.id];
                                }
                                setEditingModel({
                                  ...editingModel,
                                  category_ids: updated,
                                  category: updated[0]
                                });
                              }}
                              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                isSelected
                                  ? 'bg-[#205b63] text-white border border-cyan-400/50 shadow-sm'
                                  : 'bg-white/5 text-slate-400 hover:text-white border border-white/10 hover:border-white/20'
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-cyan-300' : 'bg-slate-600'}`} />
                              <span>{cat.name}</span>
                            </button>
                          );
                        })}

                        {/* Quick Add Category if not available */}
                        {isAddingModalCat ? (
                          <div className="inline-flex items-center gap-1.5 bg-black/60 border border-cyan-400 rounded-lg px-2 py-1 shadow-sm">
                            <input
                              type="text"
                              value={modalCatName}
                              onChange={e => setModalCatName(e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleQuickAddCategory();
                                } else if (e.key === 'Escape') {
                                  setIsAddingModalCat(false);
                                  setModalCatName('');
                                }
                              }}
                              placeholder="New category..."
                              autoFocus
                              className="bg-transparent py-0.5 text-xs font-mono text-white placeholder-slate-400 focus:outline-none w-28"
                            />
                            <button
                              type="button"
                              onClick={handleQuickAddCategory}
                              className="p-1 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer"
                              title="Save & Add Category"
                            >
                              <Check size={11} className="stroke-[3]" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setIsAddingModalCat(false);
                                setModalCatName('');
                              }}
                              className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
                              title="Cancel"
                            >
                              <X size={11} />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setIsAddingModalCat(true)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium text-cyan-300 bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 hover:border-cyan-400 transition-all cursor-pointer flex items-center gap-1"
                            title="Add a new category if not available in the list"
                          >
                            <Plus size={12} />
                            <span>New Category</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Scale Ratio
                      </label>
                      <input
                        type="text"
                        value={editingModel.scale_ratio || '1:50'}
                        onChange={(e) => setEditingModel({ ...editingModel, scale_ratio: e.target.value })}
                        placeholder="e.g. 1:50, 1:100, 1:200"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Year
                      </label>
                      <input
                        type="text"
                        value={editingModel.year || '2026'}
                        onChange={(e) => setEditingModel({ ...editingModel, year: e.target.value })}
                        placeholder="e.g. 2026"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Precision Tolerance
                      </label>
                      <input
                        type="text"
                        value={editingModel.precision_tolerance || ''}
                        onChange={(e) => setEditingModel({ ...editingModel, precision_tolerance: e.target.value })}
                        placeholder="e.g. ±0.05 mm"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Primary Materials Used
                    </label>
                    <input
                      type="text"
                      value={editingModel.materials_used || ''}
                      onChange={(e) => setEditingModel({ ...editingModel, materials_used: e.target.value })}
                      placeholder="e.g. Cast Acrylic, German Basswood, Cast Resin, Brass Detailing"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Fabrication Narrative & Methods
                    </label>
                    <textarea
                      rows={5}
                      value={editingModel.description || ''}
                      onChange={(e) => setEditingModel({ ...editingModel, description: e.target.value })}
                      placeholder="Detail the fabrication timeline, layer-by-layer assembly, laser cutting, and CNC machining..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="flex items-center gap-3 p-4 rounded-xl bg-black/40 border border-white/10">
                    <input
                      type="checkbox"
                      id="is_model_featured"
                      checked={editingModel.is_featured || false}
                      onChange={(e) => setEditingModel({ ...editingModel, is_featured: e.target.checked })}
                      className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                    />
                    <label htmlFor="is_model_featured" className="text-xs font-semibold text-slate-200 cursor-pointer">
                      Feature on Studio Scale Model Showcase Grids
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 2: MEDIA */}
              {activeTab === 'media' && (
                <div className="animate-in fade-in">
                  <MediaGalleryManager
                    mainImage={editingModel.cover_image || null}
                    onMainImageChange={(url) => setEditingModel({ ...editingModel, cover_image: url || '' })}
                    galleryImages={editingModel.gallery_images || []}
                    onGalleryImagesChange={(images) => setEditingModel({ ...editingModel, gallery_images: images })}
                    contentTypeLabel="Scale Model"
                  />
                </div>
              )}

              {/* TAB 3: FABRICATION SPECS */}
              {activeTab === 'fabrication' && (
                <div className="space-y-4 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Overall Physical Dimensions (cm)
                      </label>
                      <input
                        type="text"
                        value={editingModel.dimensions_cm || ''}
                        onChange={(e) => setEditingModel({ ...editingModel, dimensions_cm: e.target.value })}
                        placeholder="e.g. 120 × 80 × 65 cm"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Internal Illumination Scheme
                      </label>
                      <input
                        type="text"
                        value={editingModel.illumination || ''}
                        onChange={(e) => setEditingModel({ ...editingModel, illumination: e.target.value })}
                        placeholder="e.g. Micro 3000K LED Fiber-Optics with Wireless Controller"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Fabrication Lead Time
                      </label>
                      <input
                        type="text"
                        value={editingModel.day || '14 Working Days'}
                        onChange={(e) => setEditingModel({ ...editingModel, day: e.target.value })}
                        placeholder="e.g. 14 Working Days"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Machining / Tooling Methods
                      </label>
                      <input
                        type="text"
                        value={editingModel.fabrication_methods || ''}
                        onChange={(e) => setEditingModel({ ...editingModel, fabrication_methods: e.target.value })}
                        placeholder="e.g. CNC 5-Axis Milling, Laser Sintering"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
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
                      <span>Saving scale model...</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>{editingModel.id ? 'Update Model' : 'Save to Archive'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------- CATEGORY MODAL -------------------- */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => setIsCatModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-[#132527] border border-white/15 rounded-2xl p-6 shadow-2xl z-10 text-white backdrop-blur-xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <h3 className="font-display text-xl font-semibold text-white">
                  Scale Model Typologies
                </h3>
                <p className="text-xs text-slate-400">
                  Group models by fabrication style (Tower Massing, Sectional, Urban Diorama)
                </p>
              </div>
              <button
                onClick={() => setIsCatModalOpen(false)}
                className="icon-button"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="mt-5 p-4 rounded-xl bg-black/40 border border-white/10 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Add New Typology
              </p>
              <div className="space-y-2">
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Typology name (e.g. Basswood Sectional)"
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Brief description (optional)"
                  className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
              <button
                type="submit"
                disabled={creatingCat}
                className="primary-button text-xs w-full justify-center"
              >
                {creatingCat ? <Loader2 size={13} className="animate-spin" /> : <Plus size={13} />}
                <span>Create Typology</span>
              </button>
            </form>

            <div className="mt-5 space-y-2 max-h-60 overflow-y-auto custom-scrollbar" data-lenis-prevent="true">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10"
                >
                  <div>
                    <p className="text-xs font-semibold text-white">{cat.name}</p>
                    {cat.description && (
                      <p className="text-[11px] text-slate-400">{cat.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    disabled={deletingCatId === cat.id}
                    className="icon-button text-rose-400 hover:bg-rose-950/60 border-rose-800/40"
                    title="Delete category"
                  >
                    {deletingCatId === cat.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-right">
              <button
                onClick={() => setIsCatModalOpen(false)}
                className="secondary-button text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- CONFIRM DELETE MODAL -------------------- */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Scale Model"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? All associated fabrication records and photography will be removed.`}
        confirmLabel="Delete Model"
        cancelLabel="Cancel"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeleteTarget(null)}
      />
      {/* -------------------- HERO SECTION EDITOR MODAL -------------------- */}
      <HeroSectionEditorModal
        isOpen={isHeroModalOpen}
        onClose={() => setIsHeroModalOpen(false)}
        pageSlug="model-making"
        title="Scale Models Hero Section Editor"
        onSaved={() => addToast('success', 'Hero Section Updated', 'Changes are live on the public model making page.')}
      />
    </div>
  );
};
